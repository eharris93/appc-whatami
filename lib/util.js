var async = require('async'),
    exec = require('child_process').exec,
    path = require('path'),
    colors = require('colors'),
    tildeRegExp = new RegExp('^(~)(\\' + path.sep + '.*)?$'),
    winEnvVarRegExp = /(%([^%]*)%)/g;

function home() {
    return process.env[process.platform == 'win32' ? 'USERPROFILE' : 'HOME'];
}

function getInstalledSDK(cb){
    exec('appc ti sdk -o json', function(err, stdout, stderr){
        cb(null, JSON.parse(stdout).installed);
    });
}

function validateSDKVersion(sdk){
    return /(\d+\.\d+\.\d+(.GA|.v\d{14}))/.test(sdk);
}

function resolvePath() {
    var p = path.join.apply(null, arguments);
    return path.resolve(p.replace(tildeRegExp, function (s, m, n) {
        return exports.home() + (n || '/');
    }).replace(winEnvVarRegExp, function (s, m, n) {
        return process.platform == 'win32' && process.env[n] || m;
    }));
};

function login(environment, username, password, orgId, cb){
    async.series([
        function(cb){
            console.log('Logging in to account %s', username);
            exec('appc login --username ' + username + ' --password ' + password + ' --org-id ' + orgId, function(err, stdout, stderr){
                if(err){cb(err);}
                if(!!~stdout.indexOf('logged into organization')){
                    console.log('You have been logged in to %s environment, enjoy your day!', environment);
                    cb();
                }else{
                    cb(new Error('Error logging in'));
                }
            });
        }
    ]);
}

function switchEnv(environment, cb){
    async.series([
        function(cb){
            console.log('Logging out');
            exec('appc logout', function(err, stdout, stderr){
                    if(err){cb(err);}
                    cb();
            });
        },
        function(cb){
            console.log('Setting defaultEnvironment to %s', environment);
            exec('appc config set defaultEnvironment ' + environment, function(err, stdout, stderr){
                if(err){cb(err);}
                if(!!~stdout.indexOf('defaultEnvironment')){
                    cb();
                }
            });
        }
    ]);
}

function printDeviceInfo(os, devices){
  var deviceString;;
  switch(os){
    case 'android':

      for(var i = 0; i < devices.length; i++){
        deviceString = devices[i].brand + ' ' + devices[i].name + ' SDK v' + devices[i].sdk;
      }
      devices.length > 1 ? deviceString = '\tDevices: ' + deviceString.cyan : deviceString = '\tDevice: ' + deviceString.cyan;
      break;
    case 'ios':
      break;
  }
  return deviceString;
}

exports.getInstalledSDK = getInstalledSDK;
exports.validateSDKVersion = validateSDKVersion;
exports.resolvePath = resolvePath;
exports.home = home;
exports.switchEnv = switchEnv;
exports.login = login;
exports.printDeviceInfo = printDeviceInfo;
