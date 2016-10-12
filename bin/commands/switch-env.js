'use strict';

var switchEnvCommand = require('../../lib/commands/switch-env');
var config = require('../../lib/commands/config');

exports.define = function (program) {
  program
    .command('switch-env')
    .description('Switch your environment to the specified environment')
    .option('-e --environment [environment]', 'environment to be logged in to')
    .option('-u --username [username]', 'username for your appc account')
    .option('-p --password [password', 'password for your appc account')
    .option('-o --orgId [org-id]', 'org to log in to, by default will be the default org for each env set in your config')
    .action(function (command) {
      var orgId;
      if (command.orgId === undefined && command.environment != undefined) {
        if(/^prod/.test(command.environment)) {
          var prodOrg = config.get('prod.default');
          if(prodOrg != undefined) {
            orgId = prodOrg;
          }
        } else {
          var preprodOrg = config.get('preprod.default');
          if(preprodOrg != undefined) {
            orgId = preprodOrg;
          }
        }
      } else {
        orgId = command.orgId;
      }
      switchEnvCommand(command.environment, command.username, command.password, orgId);
    });
};
