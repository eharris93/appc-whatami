'use strict';

var async = require('async');
var colors = require('colors');
var fs = require('fs');
var path = require('path');
var util = require('../util.js');
var inquirer = require('inquirer');

module.exports = function (sdk, projectDir, selected) {
  var installedSDKs;
  async.series([
    function (cb) {
      if(selected) {
        var configFile = util.parseTiConfigFile();
        try {
          sdk = configFile.sdk.selected;
        } catch (e) {
          console.log('whoops error ' + e);
        }
        cb();
      } else {
        util.getInstalledSDK(function (err, result) {
          if (err) {
            cb(err);
          }

          installedSDKs = result;
          cb();
        });
      }
    },

    function (cb) {
      var toAsk = [{
        type: 'list',
        name: 'sdk',
        message:' What SDK to use?',
        choices: installedSDKs,
        when: function() {
          return selected === undefined && (sdk === undefined || !util.validateSDKVersion(sdk));
        }
      },{
        type: 'input',
        name: 'projectDir',
        message: 'What\'s the location of the project',
        default: process.cwd(),
        when: function() {
          return projectDir === undefined;
        },
        validate: function(projDir) {
          projDir = util.resolvePath(projDir);
          if (!fs.existsSync(projDir) || !fs.statSync(projDir).isDirectory()) {
            return 'That\'s not a valid directory!';
          }

          var tiappLoc = path.join(projDir, 'tiapp.xml');

          if (!fs.existsSync(tiappLoc)) {
            return 'That directory does not have a tiapp.xml!';
          }
          return true;
        }
      }];

      inquirer.prompt(toAsk).then(function(answers) {
        if (answers.sdk) {
          sdk = answers.sdk;
        }

        if (answers.projectDir) {
          projectDir = util.resolvePath(answers.projectDir);
        }
        cb();
      });
    },

    function (cb) {
      if (util.validateSDKVersion(sdk)) {
        try {
          var tiappLoc = path.join(projectDir, 'tiapp.xml');
          var tiapp = require('tiapp.xml').load(tiappLoc);
          tiapp.sdkVersion = sdk;
          tiapp.write();
          console.log('tiapp.xml at location %s has been updated to SDK version %s', tiappLoc.magenta, sdk.magenta);
          cb();
        } catch (e) {
          console.log(e);
          console.log('Can\'t find a tiapp.xml. Are you sure this is a valid project?');
          cb();
        }
      }
    }
  ]);
};
