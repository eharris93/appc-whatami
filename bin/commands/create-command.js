'use strict';

var createCommand = require('../../lib/commands/create-command');

exports.define = function (program) {
  program
    .command('create-command', '', {noHelp: true})
    .description('Creates the necessary files to start making a new command')
    .option('-t --title [title]', 'Name of the command')
    .option('-d --desc [description]', 'Description of the command')
    .action(function (command) {
      createCommand(command.title, command.desc);
    });
};
