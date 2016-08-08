'use strict';

var removeCommand = require('../../lib/commands/remove');

exports.define = function (program) {
  program
    .command('remove')
    .description('Remove SDKs and CLI cores')
    .option('-s, --sdk [sdk]', 'Glob to match SDK versions against')
    .option('-c --core [core]', 'Glob to match core versions against')
    .action(function (command) {
      removeCommand(command.sdk, command.core);
    });
};
