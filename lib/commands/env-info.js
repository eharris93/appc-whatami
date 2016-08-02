'use strict';

var colors = require('colors');
var path = require('path');
var async = require('async');
var exec = require('child_process').exec;
var fs = require('fs');
var util = require('../util.js');

module.exports = function () {
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

        //Build iOS specific info here
        var iosInfo = {};
        iosInfo.xcode = output.ios.selectedXcode.version;
        iosInfo.devices = output.ios.devices;
        env.ios = iosInfo;

        //Build Windows specific info here
        var windowsInfo = {};
        env.windows = windowsInfo;
        cb();
      });
    },

    function (cb) {
      switch (process.platform) {
        case 'darwin':
          try {
            fs.readFile('/Applications/Appcelerator Studio/version.txt', 'utf-8', function (err, data) {
              if (err) {
                env.studio = 'Could not read file, Studio may not be installed';
              }

              env.studio = data.match(/!define VERSION (\d+\.\d+\.\d\.\d{12})/)[1];
              cb();
            });
          } catch (e) {
            console.log(e);
            cb();
          }

          break;
        case 'win32':
          try {
            var file = path.join(process.env.USERPROFILE, 'AppData', 'Roaming', 'Appcelerator', 'Appcelerator Studio', 'version.txt');
            fs.readFile(file, 'utf-8', function (err, data) {
              if (err) {
                env.studio = 'Could not read file, Studio may not be installed';
              }

              env.studio = data.match(/!define VERSION (\d+.\d+.\d.\d{12})/)[1];
              cb();
            });
          } catch (e) {
            console.log(e);
            cb();
          }

          break;
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
    console.log('Android:');
    console.log('\tInstalled SDKs: %s', env.android.targets.toString().cyan);
    if (env.android.devices.length > 0) {
      console.log(util.printDeviceInfo('android', env.android.devices));
    }

    switch (process.platform) {
      case 'darwin':
        console.log('iOS:');
        console.log('\tXcode: %s', env.ios.xcode.cyan);
        if (env.ios.devices.length > 1) {
          console.log(util.printDeviceInfo('ios', env.ios.devices));
        } else {
          console.log('\tNo iOS devices detected'.red);

        }
        break;
      case 'win32':
        console.log('Windows');
        break;
    }
  });
};
