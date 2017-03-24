
// link: https://www.npmjs.com/package/minimist

var _parser = require('minimist');
var _fs = require('fs');

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
    console.log('**** get');
  } else if (_commands.indexOf('list') != -1) {
    list(_argv);
  }

  // check switches (if necessary)

  if (_argv.hasOwnProperty("list")) {
    console.log("list");
  } else if (_argv.hasOwnProperty("get")) {
    console.log("get");
  } else if (_argv.hasOwnProperty("help")) {
    console.log("help***");
  }


  // TODO: remove debug (someday)
  console.log(_argv);
};

/*
 *  switches:
 *    keywords -- list only the archetypes matching such keywords
 *    pattern -- list out only the archetypes that matches this pattern (e.g. html*)
 */
var list = (_argv) => {
  let _json = _updateArchetypeJson();
  // check switches

  console.log(_json);

}


/**
 *  actual contents returned to caller
 */
module.exports = {
  "version": "1.0.0",
  "parse": _parse
};
