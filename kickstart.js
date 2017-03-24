#!/usr/bin/env node

'use strict';

var commandParser = require("./CodeModules/CommandParser");

commandParser.parse(process.argv);


// console.log(commandParser.version);

/*
const program = require('commander');

var _runCommandMode = (program) => {
  program
    .version('1.0.0')
    .command('get <archetypeOrID> [targetLocation]', 'get the project template based on the given archetype or its ID')
    .command('list [archetypePattern]', 'list available archetypes, filtering by archetype patterns is possible', {isDefault: true})
    .parse(process.argv);
};


var _runSimpleExample = (program) => {
  program
    .version('0.0.1')
    .option('-p, --peppers', 'Add peppers')
    .option('-P, --pineapple', 'Add pineapple')
    .option('-b, --bbq-sauce', 'Add bbq sauce')
    .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
    .parse(process.argv);

  if (program.peppers) console.log('peppers provided');
  console.log(program);
};

// actual execution of the command
_runSimpleExample(program);
_runCommandMode(program);
*/
