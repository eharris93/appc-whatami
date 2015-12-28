var program = require('commander'),
    fields = require('fields'),
    switchEnvCommand = require('../../lib/commands/switch-env');

exports.define = function(program){
  program
    .command('switch-env')
    .description('Switch your environment to the specified environment')
    .option('-e --environment [environment]', 'environment to be logged in to')
    .option('-u --username [username]', 'username for your appc account')
    .option('-p --password [password', 'password for your appc account')
    .option('-o --orgId [org-id]', 'org to log in to, by default will be the team org for each env')
    .action(function(command){
      var orgId;
      if(command.orgId === undefined){
              /^prod/.test(command.environment) ? orgId = 'prodOrg' : orgId = 'preProdOrg';
          }else{
              orgId = command.orgId;
          }
      switchEnvCommand(command.environment, command.username, command.password, orgId);
    });
};
