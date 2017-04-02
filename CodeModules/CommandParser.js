
// link: https://www.npmjs.com/package/minimist
//require('ssl-root-cas').inject();
//var _gitApiInstance = require('github');
//var _gitApi = new _gitApiInstance({ debug: true });

var _parser = require('minimist');
var _fs = require('fs');
var _path = require('path');
var _sprintf = require("sprintf-js").sprintf;
// ** node-cmd
var _cmd = require('node-cmd');
// ** q promises framework
var _q = require('q');

var _uuid = require('./UuidGenerator');

var _archetypesJson = null;
var _lastAccessTimestamp = new Date().getTime();






/* ---------------- */
/*  function area   */
/* ---------------- */

var _updateArchetypeJson = () => {
  let _needUpdate = (new Date().getTime() - _lastAccessTimestamp) > (30*60*1000);

  if (_archetypesJson == null || _needUpdate == true) {
    _lastAccessTimestamp = new Date().getTime();
    _archetypesJson = JSON.parse(_fs.readFileSync(__dirname+'/../Resources/archetypes.json'));
  }
  return _archetypesJson;
};


var _parse = (arguments) => {
  let _argv = _parser(arguments, {});
  let _commands = _argv['_'];

  // check commands
  if (_commands.indexOf('help') != -1) {
    console.log('**** help');

  } else if (_commands.indexOf('get') != -1) {
    get(_argv);
  } else if (_commands.indexOf('list') != -1) {
    list(_argv);
  } else {
    // unknown command (treat as list by default)
    list(_argv);
  }


  // TODO: remove debug (someday)
  //console.log(_argv);
};

/*
 *  switches
 *  - id => the archetype id (if none is given return error)
 *  - dest (optional) => destination path for extracting template.tar.gz
 */
var get = (_argv) => {
  var _destFolder = _path.join(__dirname, '../temp/');

  // get the target file path for extraction
  if (_argv.hasOwnProperty('dest')) {
    _destFolder = _argv.dest+'/';
  }
  // get the archetype id
  if (_argv.hasOwnProperty('id')) {
    var _id = _argv.id;
    var _url = 'https://api.github.com/repos/logmonster/k-fuse/contents/Templates/';
    var _uuidName = _uuid.generate();

    if (typeof(_id)=='number') {
      _url += _sprintf('%02d', (_id) ) + '/template.tar.gz';
      // 1st level curl to get back the download_url;
      _q.nfcall(_cmd.get, 'curl '+_url).
        then(function(data) {}).
        fail(function(err) {
          // direct curl would result in "err" (weird)
          var _downloadUrl = JSON.parse(err).download_url;

          // 2nd level curl now
          _q.nfcall(_cmd.get,
            'curl '+_downloadUrl+' > '+
            _destFolder+_uuidName+'-template.tar.gz').
            then(function(data) {
              // 3rd level, run tar -xvf
              _q.nfcall(_cmd.get,
                // rm after tar -xvf
                'tar -xvf '+_destFolder+_uuidName+'-template.tar.gz -C '+
                _destFolder+' && rm '+_destFolder+_uuidName+'-template.tar.gz'
              ).then(function(data) {
                  console.log('* extraction done');
                }).
                fail(function(err) {
                  console.log('** ERR ');
                  console.log(err);
                }).
                done(); // 3rd level, tar and rm
            }).
            fail(function(err) {
              console.log('*** ERR: ');
              console.log(err);
              return;
            }).
            done(); // 2nd curl download_url
        }).
        done(); // 1st curl the url(s) for 2nd level curl
    }

  } else {
    console.log('** ERR: you need to provide an archetype id !!');
    return;
  }
};

/*
 *  switches:
 *    keywords -- list only the archetypes matching such keywords
 *    pattern -- list out only the archetypes that matches this pattern (e.g. html*)
 */
var list = (_argv) => {
  // create a clone (but at the same update the archetypesJson as well)
  let _json = JSON.parse(JSON.stringify(_updateArchetypeJson()));

  // check switches

  // --------------------
  // * keywords filtering
  // --------------------
  if (_argv.hasOwnProperty('keywords')) {
    let _sValArr = _argv['keywords'].split(",");
    let _size = _json.archetypes.length;

    for (let _i=_size-1; _i>=0; _i--) {
      let _kwordsArr = _json.archetypes[_i]['keywords'];
      let _found = false;

      for (let _j=0; _j<_sValArr.length; _j++) {
        if (_kwordsArr.indexOf(_sValArr[_j].trim()) != -1) {
          _found = true;
          break;
        }
      } // end -- for (_sValArr indexOf check)

      if (_found==false) _json.archetypes.splice(_i, 1);

    } // end -- for (loop from back)

  } else if (_argv.hasOwnProperty('pattern')) {

    // ----------------------------------
    // * patterns (description) filtering
    // CAVEAT => when handling *node* => misinterprete as "node_modules" maybe OS level bug???
    //  solution -> quote the terms using "" or ''
    // ----------------------------------
    let _sVal = _argv['pattern'].trim();
    let _regExp = new RegExp( '^'+_sVal.replace(new RegExp(/\*/, 'g'), '.*')+'$' );
    let _size = _json.archetypes.length;

    for (let _i=_size-1; _i>=0; _i--) {
      let _desc = _json.archetypes[_i]['desc'];
      if (_regExp.test(_desc) == false) {
        _json.archetypes.splice(_i, 1);
      } // end -- if (pattern match with _desc)
    } // end -- for (backward loop on archetypes)
  }

  // ---------------------------------
  // * final display (after filtering)
  // ---------------------------------

  let _len = _json.archetypes.length;

  console.log('%s', '\r\nThe list of available archetypes are as follows:\r\n\r\n');
  console.log(_sprintf('%-s    \t%-50s    %s', 'id', 'archetype description', 'keywords' ));
  console.log(_sprintf("%s", '------------------------------------------------------------------------------------'));
  for (let _i=0; _i<_len; _i++) {
    let _info = _json.archetypes[_i];
    console.log(_sprintf('%02d    \t%-50s    %s', _info.id, _info.desc, _info.keywords.toString() ));
  }
  console.log(_sprintf('\r\ncount: %+3s', (_len+'') ));
  console.log("\r\n");
}


/**
 *  actual contents returned to caller
 */
module.exports = {
  "version": "1.0.0",
  "parse": _parse
};
