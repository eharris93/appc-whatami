'use strict';

var envCheckCommand = require('../../lib/commands/env-info');

exports.define = function (program) {
  program
    .command('env-info')
    .description('Prints out information about your environment')
    .action(function (command) {
      envCheckCommand();
    });
};
