'use strict';

var tiappCommand = require('../../lib/commands/update-tiapp');

exports.define = function (program) {
  program
    .command('update-tiapp')
    .description('Update the current apps tiapp.xml to either the latest SDK on machine, or the specified SDK')
    .option('-s --sdk [sdk]', 'SDK to change to')
    .option('-D --project-dir [project-dir]', 'path to the project, by default it will use the cwd')
    .option('--selected', 'update tiapp to the selected SDK in ti sdk')
    .action(function (command) {
      if(command.selected && command.sdk) {
        console.error('Whoa you can\'t use all of those options at the same time bub! Try only one of --sdk and --selected at a time!');
        process.exit(1);
      }
      tiappCommand(command.sdk, command.projectDir, command.selected);
    });
};
