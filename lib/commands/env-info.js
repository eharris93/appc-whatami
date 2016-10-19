'use strict';

var colors = require('colors');
var path = require('path');
var async = require('async');
var exec = require('child_process').exec;
var fs = require('fs');
var util = require('../util.js');

module.exports = function (platform) {
  var env = {};
  async.parallel([
    function (cb) {
      exec('appc info -o json', {maxBuffer: 2000 * 1024}, function (err, stdout, stderr) {
        if (err) {console.log(stderr);cb(err);}

        var output = JSON.parse(stdout);
        env.appcCore = output.appcCLI.corepackage.version;
        env.appcNpm = output.appcCLI.installer.version;
        env.sdk = output.titaniumCLI.selectedSDK;
        env.node = output.node.version;
        env.npm = output.npm.version;
        env.os = output.os;

        if(platform === 'android' || platform === 'all') {
          //Build Android specific info here
          var androidInfo = {};
          androidInfo.devices = output.android.devices;
          androidInfo.ndk = output.android.ndk;
          var targets = [];
          for (var i in output.android.targets) {
            targets.push(output.android.targets[i].id);
          }
          androidInfo.targets = targets;
          env.android = androidInfo;
        }

        if(!util.isWin()) {
          //Build iOS specific info here
          if(platform === 'ios' || platform === 'all') {
            var iosInfo = {};
            iosInfo.xcode = output.ios.selectedXcode.version;
            iosInfo.devices = output.ios.devices;
            env.ios = iosInfo;
          }
        } else {
          //Build Windows specific info here
          if(platform === 'windows' || platform === 'all') {

            var windowsInfo = {};
            windowsInfo.devices = output.windows.devices;
            var sdks = {
              'windowsphone': [],
              'windows': []
            };
            for(var i in output.windows.windowsphone) {
              try {
                //SDKs pre 6.0.0 don't have this info
                output.windows.windowsphone[i].sdks.length > 0 ? sdks.windowsphone.push(output.windows.windowsphone[i].sdks) : sdks.windowsphone.push(output.windows.windowsphone[i].version);
              } catch(e) {
                //do nothing
              }
            }
            var windowsSDKs = [];
            for(var i in output.windows.windows) {
              try {
                //SDKs pre 6.0.0 don't have this info
                output.windows.windows[i].sdks.length > 0 ? sdks.windows.push(output.windows.windows[i].sdks) : sdks.windows.push(output.windows.windows[i].version);
              } catch(e) {
                //do nothing
              }
            }
            windowsInfo.sdks = sdks;
            var visualstudio = [];
            for(var i in output.windows.visualstudio) {
              visualstudio.push(output.windows.visualstudio[i].version);
            }
            windowsInfo.visualstudio = visualstudio;
            env.windows = windowsInfo;
          }
        }
        cb();
      });
    },

    function (cb) {

      var file = util.isWin() ?  path.join(process.env.USERPROFILE, 'AppData', 'Roaming', 'Appcelerator', 'Appcelerator Studio', 'version.txt') : path.join('Applications', 'Appcelerator Studio', 'version.txt');
      try {
        fs.readFile(file, 'utf-8', function (err, data) {
          if (err) {
            env.studio = 'Could not read version, Studio may not be installed'.red;
          } else {
            env.studio = data.match(/!define VERSION (\d+\.\d+\.\d\.\d{12})/)[1];
          }
          cb();
        });
      } catch (e) {
        console.log(e);
        cb();
      }
    }
  ], function () {
    console.log('Environment information:');
    console.log('OS: %s %s', env.os.name.cyan, env.os.version.cyan);
    console.log('Appc core: %s', env.appcCore.cyan);
    console.log('Appc NPM: %s', env.appcNpm.cyan);
    console.log('Ti SDK: %s', env.sdk.cyan);
    console.log('Appc Studio: %s', env.studio.cyan);
    console.log('Node: %s', env.node.cyan);
    console.log('NPM: %s', env.npm.cyan);
    if(platform === 'android' || platform === 'all') {
      console.log('Android:');
      console.log('\tInstalled SDKs: %s', env.android.targets.toString().cyan);
      if (env.android.devices.length > 0) {
        console.log(util.printDeviceInfo('android', env.android.devices));
      }
    }
    switch (process.platform) {
      case 'darwin':
        if(platform === 'ios' || platform === 'all') {
          console.log('iOS:');
          console.log('\tXcode: %s', env.ios.xcode.cyan);
          if (env.ios.devices.length > 1) {
            console.log(util.printDeviceInfo('ios', env.ios.devices));
          } else {
            console.log('\tNo iOS devices detected'.red);

          }
        }
        break;
      case 'win32':
        if(platform === 'windows' || platform === 'all') {
          console.log('Windows:');
          console.log('\tInstalled Windows Phone SDKs: %s', env.windows.sdks.windowsphone.toString().cyan);
          console.log('\tInstalled Windows  SDKs: %s', env.windows.sdks.windows.toString().cyan);
          console.log('\tInstalled Visual Studio: %s', env.windows.visualstudio.toString().cyan);
          if(env.windows.devices.length > 0) {
            console.log(util.printDeviceInfo('windows', env.windows.devices))
          }
        }
        break;
    }
  });
};
