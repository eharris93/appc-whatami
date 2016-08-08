'use strict';

var removeCommand = require('../../lib/commands/remove');

exports.define = function (program) {
  program
    .command('remove')
    .description('Remove SDKs and CLI cores')
    .option('-s, --sdk [sdk]', 'Glob to match SDK versions against')
    .option('-c --core [core]', 'Glob to match core versions against')
    .on('--help', function () {
      console.log('Examples:\n');
      console.log('\tqe remove --core 5.3.* --sdk 6.*.* \t\t        This wall remove all 5.3.X versions of the core and 6.X.X versions of SDK');
      console.log(('\n'));
    })
    .action(function (command) {
      removeCommand(command.sdk, command.core);
    });
};
