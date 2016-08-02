'use strict';

var async = require('async');
var colors = require('colors');
var util = require('../util.js');

module.exports = function (npm, core, sdk, branch) {
  async.series([
    function (cb) {
      if (npm) {
        if (npm === undefined || npm === true) {
          console.log('Installing latest npm package!');
          util.installNPM(npm, function(err) {
            if(err) {
              cb(new Error(err));
            } else {
              cb();
            }
          });
        } else {
          console.log('Installing npm package at version ' + npm + '!');
          util.installNPM(npm, function(err) {
            if(err) {
              console.log('thrown err');
              cb(new Error(err));
            } else {
              cb();
            }
          });
        }
      } else {
        cb();
      }
    },
    function (cb) {
      if (sdk || branch) {
        if (branch === true) {
          cb(new Error('You must specify a branch to use -b'));
          cb;
        }

        if (sdk === undefined) {
          branch = branch === undefined ? 'master' : branch;
          util.installSDK(sdk, branch, function (err) {
            if (err) {cb(err);}

            cb();
          });
        } else {
          util.installSDK(sdk, branch, function (err) {
            if (err) {cb(err);}

            cb();
          });
        }
      } else {
        cb();
      }
    },
    function (cb) {
      if (core) {
        console.log(core);
        core = core === (undefined || true) ? 'latest' : core;
        console.log('Grabbing ' + core + ' CLI, let\'s switch to pre-prod!');
        util.switchEnv('preproduction', function (err) {
          if (err) {cb(err);}
          util.installCore(core, function (err) {
            if (err) {cb(err);}

            cb();
          });
        });
      } else {
        cb();
      }
    }
  ],
    function(err) {
      if(err) {
        console.log('whoops looks like something went wrong. Here\'s the error message'.red);
        console.log(err);
      }
    });
};
