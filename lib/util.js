'use strict';

var async = require('async');
var  exec = require('child_process').exec;
var  path = require('path');
var  colors = require('colors');
var  tildeRegExp = new RegExp('^(~)(\\' + path.sep + '.*)?$');
var  winEnvVarRegExp = /(%([^%]*)%)/g;
var  semverRegex = require('semver-regex');
var userHome = require('user-home');


function home () {
  return userHome;
}

function configDir () {
  return path.join(home(), '.qe');
}

function configFile () {
  return path.join(configDir(), 'config.json');
}

function getInstalledSDK (cb) {
  exec('appc ti sdk -o json', function (err, stdout, stderr) {
    if (err) {cb(err);}
    var sdkObj = JSON.parse(stdout).installed;
    var sdks = Object.keys(sdkObj).map(function (key) {return key;});
    cb(null, sdks);
  });
}

function validateSDKVersion (sdk) {
  return /(\d+\.\d+\.\d+(.GA|.v\d{14}))/.test(sdk);
}

function resolvePath () {
  var p = path.join.apply(null, arguments);
  return path.resolve(p.replace(tildeRegExp, function (s, m, n) {
    return exports.home() + (n || '/');
  }).replace(winEnvVarRegExp, function (s, m, n) {
    return process.platform === 'win32' && process.env[n] || m;
  }));
}

function login (username, password, orgId, cb) {
  console.log('Logging in to account %s', username);
  exec('appc login --username ' + username + ' --password ' + password + ' --org-id ' + orgId, function (err, stdout, stderr) {
    if (err) {
      console.log(err);
      cb(err);
    }
    if (!!~stdout.indexOf('logged into organization')) {
      console.log('You have been logged in to %s, enjoy your day!', orgId);
      cb();
    } else {
      console.log(stdout);
      cb(new Error('Error logging in'));
    }
  });
}

function switchEnv (environment, cb) {
  async.series([
    function (next) {
      console.log('Logging out');
      exec('appc logout', function (err, stdout, stderr) {
        if (err) {
          next(err);
        }
        next();
      });
    },
    function (next) {
      console.log('Setting defaultEnvironment to %s', environment);
      exec('appc config set defaultEnvironment ' + environment, function (err, stdout, stderr) {
        if (err) {
          next(err);
        }
        if (!!~stdout.indexOf('defaultEnvironment')) {
          next();
        }
      });
    }
  ], function () {
    cb();
  });
}

function printDeviceInfo (os, devices) {
  var deviceString;
  switch (os) {
    case 'android':
      for (var i = 0; i < devices.length; i++) {
        deviceString = devices[i].brand + ' ' + devices[i].name + ' SDK v' + devices[i].sdk;
      }

      if (devices.length > 1) {
        deviceString = '\tDevices: ' + deviceString.cyan;
      } else {
        deviceString = '\tDevice: ' + deviceString.cyan;
      }
      break;
    case 'ios':
      break;
  }
  return deviceString;
}

function installSDK (sdk, branch, cb) {
  var cmd = 'appc ti sdk install -d ';
  if (!sdk) {
    cmd += '--branch ' + branch;
    console.log('Installing SDK from ' + branch + ' branch, this may take a little time :)');
  } else {
    cmd += sdk;
    console.log('Installing SDK ' + sdk + ' , this may take a little time :)');
  }

  exec(cmd, function (err, stdout, stderr) {
    if (err) {
      var msg = err.toString();
      if (!!~msg.indexOf('No branches found!') || !!~msg.indexOf('No releases found!')) {
        console.log('Can\'t seem to find that SDK sorry');
      } else {
        console.log(err);
        cb(new Error(err));
      }
    }

    if (!!~stdout.indexOf('successfully installed!') || !!~stdout.indexOf('already installed')) {
      var version = stdout.match(/\d+\.\d+\.\d+(.GA|.v\d{14})/)[0];
      console.log(version + ' installed');
      cb();
    }
  });
}

function installNPM (version, cb) {
  var cmd = version === (undefined || true) ? 'npm install -g appcelerator' : 'npm install -g appcelerator@' + version;
  exec(cmd, function (err, stdout, stderr) {
    if (err) {cb(err);}
    if (!!~stdout.indexOf('appcelerator@')) {
      var version = semverRegex().exec(stdout);
      console.log('appc npm@' + version + ' installed');
      cb();
    }
  });
}

function installCore (version, cb) {
  var cmd = 'appc use ';
  if (version) {
    cmd += version;
  }

  exec(cmd, function (err, stdout, stderr) {
    if (err) {
      cb(err);
    }

    if (!!~stdout.indexOf('Installed!!') || !!~stdout.indexOf('active version')) {
      var version = semverRegex().exec(stdout);
      console.log(version + ' installed');
      cb();
    }
  });
}

exports.getInstalledSDK = getInstalledSDK;
exports.validateSDKVersion = validateSDKVersion;
exports.resolvePath = resolvePath;
exports.home = home;
exports.switchEnv = switchEnv;
exports.login = login;
exports.printDeviceInfo = printDeviceInfo;
exports.installSDK = installSDK;
exports.installNPM = installNPM;
exports.installCore = installCore;
exports.configDir = configDir;
exports.configFile = configFile;
