'use strict';

var colors = require('colors');
var async = require('async');
var inquirer = require('inquirer');
var util = require('../util.js');
var config = require('./config');


function getOrgId() {
  return function(answers) {
    return config.get(answers.environment+'.default');
  };
}

module.exports = function (environment, username, password, orgId) {
  async.series([
    function (cb) {
      var toAsk = [{
        type: 'input',
        name: 'username',
        message: 'What is your appc username?',
        default: config.get('username'),
        validate: function (value) {
          var valid = !!value.length;
          return valid || 'Please enter a username';
        },
        when: function() {
          return username === undefined;
        }
      },{
        type: 'password',
        name: 'password',
        message: 'What is your appc password?',
        when: function() {
          return password === undefined;
        }
      },{
        type: 'list',
        name: 'environment',
        message: 'What environment to log in to?',
        choices: [
          'prod',
          'preprod'
        ],
        when: function() {
          return environment === undefined;
        }
      }, {
        type: 'input',
        name: 'orgId',
        message: 'What is the org ID of the org you wish to log into?',
        default: getOrgId(),
        when: function() {
          return orgId === undefined;
        }
      }
    ];

      inquirer.prompt(toAsk).then(function (answers) {
        if (answers.username) {
          username = answers.username;
        }

        if (answers.password) {
          password = answers.password;
        }

        if (answers.environment) {
          environment = answers.environment;
        }

        if(answers.orgId) {
          orgId = answers.orgId;
        }

        cb();
      });
    },
    function (cb) {
      var validEnvs = ['prod', 'production', 'preprod', 'preproduction'];
      switch (environment) {
        case 'prod':
        case 'production':
          util.switchEnv('production', function (err) {
            if (err) {
              cb(err);
            }
            util.login(username, password, orgId, function (err) {
              if (err) {
                cb(err);
              }
              console.log('logged in fine!');
            });
          });
          break;
        case 'preprod':
        case 'preproduction':
          util.switchEnv('preproduction', function (err) {
            if (err) {
              cb(err);
            }
            util.login(username, password, orgId, function (err) {
              if (err) {
                cb(err);
              }
              console.log('logged in fine!');
            });
          });
          break;
        default:
          console.log('%s is not a valid environment. Please choose one of the following:', environment.red);
          console.log('\t' + validEnvs.join('\n \t').cyan);
      }
    }
  ]);
};
