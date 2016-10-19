'use strict';

var envCheckCommand = require('../../lib/commands/env-info');

exports.define = function (program) {
  program
    .command('env-info')
    .description('Prints out information about your environment')
    .option('-p,--platform [platform]', 'Specify a platform to print info for')
    .action(function (command) {
      var platform = command.platform;
      if(['windows', 'ios', 'android', 'all'].indexOf(command.platform) === -1) {
        console.log('Platform is not valid defaulting to all'.red);
        platform = 'all';
      }
      envCheckCommand(platform);
    });
};
