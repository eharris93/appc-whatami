'use strict';

var configCommand = require('../../lib/commands/config');

exports.define = function (program) {
  program
    .command('config')
    .description('Get, set and remove values stored in the config')
    .action(function (action, key, value, command) {
      if (arguments.length === 1) {
        action = 'list';
      } else if (arguments.length === 2) {
        key = null;
      } else if (arguments.length === 3) {
        value = null;
      }
      configCommand(action, key, value, function(err, value) {
        console.log(value);
      });
    });
};
