'use strict';

var async = require('async');
var colors = require('colors');
var inquirer = require('inquirer');
var util = require('../util');
var sdkRegexp;
var coreRegexp;
var sdksToRemove;
var coresToRemove;

module.exports = function (sdkGlob, coreGlob) {
  var installedSDKs;
  var installedCores;
  async.parallel([
    function (cb) {
      util.getInstalledSDK(function (err, result) {
        if (err) {
          cb(err);
        }

        installedSDKs = result;
        cb();
      });
    },
    function (cb) {
      util.getInstalledCores(function (err, result) {
        if (err) {
          cb(err);
        }
        installedCores = result;
        cb();
      });
    }
  ], function() {
    var toAsk = [{
      type: 'checkbox',
      name: 'sdks',
      message:' What SDKs to delete?',
      choices: installedSDKs,
      when: function () {
        return sdkGlob === undefined;
      }
    },{
      type: 'checkbox',
      name: 'cores',
      message:' What cores to delete?',
      choices: installedCores,
      when: function () {
        return coreGlob === undefined;
      }
    }];

    inquirer.prompt(toAsk).then(function(answers) {
      async.series([
        function(cb) {

          if(answers.sdks) {
            sdksToRemove = answers.sdks;
          } else {
            sdkRegexp = new RegExp('^' + sdkGlob.replace('.', '\\.').replace('*', '.*') + '$');
            sdksToRemove = installedSDKs.filter(function (sdk) {
              return sdkRegexp.test(sdk);
            });
          }

          if(answers.cores) {
            coresToRemove = answers.cores;
          } else {
            coreRegexp = new RegExp('^' + coreGlob.replace('.', '\\.').replace('*', '.*') + '$');
            coresToRemove = installedCores.filter(function (core) {
              return coreRegexp.test(core);
            });
          }
          cb();
        },
        function(cb) {
          console.log('This will remove the following SDKs and cores');
          console.log('SDKs: ' + sdksToRemove.toString().cyan);
          console.log('Cores: ' + coresToRemove.toString().cyan);
          var confirm = [{
            type: 'confirm',
            name: 'confirmDelete',
            message: 'Please confirm deletion'
          }];
          inquirer.prompt(confirm).then(function(answer) {
            if (answer.confirmDelete) {
              async.series([
                function (cb) {
                  coresToRemove.forEach(function (core) {
                    util.removeCore(core, function(err, coreVer) {
                      if (err) {
                        console.warn('Could not remove ' + coreVer);
                      } else {
                        console.log('Removed ' + coreVer);
                      }
                    });
                  });
                  cb();
                }, function (cb) {
                  sdksToRemove.forEach(function (sdk) {
                    util.removeSDK(sdk, function(err, sdkVer) {
                      if (err) {
                        console.warn('Could not remove ' + sdkVer);
                      } else {
                        console.log('Removed ' + sdkVer);
                      }
                    });
                  });
                  cb();
                }
              ]);
            } else {
              console.log('Removal cancelled');
              cb();
            }
          });
        }
      ]);
    });
  });
};
