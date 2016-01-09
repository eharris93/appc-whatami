'use strict';

var tiappCommand = require('../../lib/commands/update-tiapp');

exports.define = function (program) {
  program
    .command('update-tiapp')
    .description('Update the current apps tiapp.xml to either the latest SDK on machine, or the specified SDK')
    .option('-s --sdk [sdk]', 'SDK to change to')
    .option('-D --project-dir [project-dir]', 'path to the project, by default it will use the cwd')
    .parse(process.argv)
    .action(function (command) {
      tiappCommand(command.sdk, command.projectDir);
    });
};
