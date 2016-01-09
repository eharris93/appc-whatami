'use strict';

var colors = require('colors');
var async = require('async');
var fields = require('fields');
var util = require('../util.js');

module.exports = function (environment, username, password, orgId) {
  async.series([
    function (cb) {
      var toAsk = {};
      if (username === undefined) {
        toAsk.username = fields.text({
          title: 'What is your appc username?',
          validate: function (value, callback) {
            callback(!value.length && new Error('Please enter a username'), value);
          }
        });
      }

      if (password === undefined) {
        toAsk.password = fields.text({
          title: 'What is your appc password?',
          password: true
        });
      }

      if (environment === undefined) {
        toAsk.environment = fields.select({
          title: 'What environment to log in to?',
          numbered: true,
          relistOnError: true,
          complete: true,
          options: [
            'prod',
            'preprod'
          ]
        });
      }

      fields.set(toAsk).prompt(function (err, value) {
        if (err) {
          console.error('There was an error!\n' + err);
        } else {
          if (toAsk.username) {
            username = value.username;
          }

          if (toAsk.password) {
            password = value.password;
          }

          if (toAsk.environment) {
            environment = value.environment;
          }

          cb();
        }
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
            util.login(environment, username, password, orgId, function (err) {
              if (err) {
                cb(err);
              }
              console.log('logged in fine!');
            });
          });
          break;
        case 'preprod':
        case 'preproduction':
          util.switchEnv('preproduction', username, password, orgId);
          break;
        default:
          console.log('%s is not a valid environment. Please choose one of the following:', environment.red);
          console.log('\t' + validEnvs.join('\n \t').cyan);
      }
    }
  ]);
};
