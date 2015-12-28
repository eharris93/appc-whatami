#!/usr/bin/env node

var program = require('commander'),
    getLatestCommand = require('../../lib/commands/get-latest.js');

exports.define = function(program){
  program
    .command('get-latest')
    .description('Get the latest for appc-cli (core and npm) and ti SDK. Versions can be specified for appc-cli, branch or version for ti sdk')
    .option('-n --npm [npm]', 'the version for the appc-cli npm package')
    .option('-c --core [core]', 'the version for the appc-cli core package')
    .option('-s --sdk [sdk]', 'the specific SDK to install, overrides --branch')
    .option('-b --branch [branch]', 'the branch to pull from for the SDK')
    .parse(process.argv)
    .action(function(command){
      getLatestCommand(command.npm, command.core, command.sdk, command.branch);
    });
};
