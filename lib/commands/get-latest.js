var async = require('async'),
    exec = require('child_process').exec,
    colors = require('colors'),
    fields = require('fields'),
    fs = require('fs'),
    path = require('path'),
    util = require('../util.js');

module.exports = function(npm, core, sdk, branch){
   async.series([
        // function(cb){
        //     if(core === undefined){
        //         core = 'latest';
        //     }
        //     console.log('Grabbing latest CLI, let's switch to pre-prod!');
        //     util.switchEnv('preprod',function(err){
        //         if(err){cb(err);}
        //         exec('appc use ' + core, function(err, stdout, stderr){
        //             if(err){cb(err);}
        //             if(!!~stdout.indexOf('Installed!!')){
        //                 cb();
        //             }
        //         });
        //     })
        // },
        function(cb){
            if(npm === undefined){
                console.log('Installing latest npm package!');
                exec('npm install -g appcelerator', function(err, stdout, stderr){
                    if(err){cb(err);}
                    if(!!~stdout.indexOf('appcelerator@')){
                        var version = stdout.match(/appcelerator@\d.\d.\d/);
                        console.log(version + ' installed');
                        cb();
                    }
                });
            }else{
                console.log('Installing npm package at version ' + npm + '!');
                exec('npm install -g appcelerator@'+npm, function(err, stdout, stderr){
                    if(err){cb(err);}
                    if(!!~stdout.indexOf('appcelerator@')){
                        var version = stdout.match(/@\d.\d.\d/);
                        console.log(version + ' installed');
                        cb();
                    }
                });
            }
        },
        function(cb){
            if(sdk === undefined){
                branch = branch === undefined ? 'master' : branch;
                console.log('Installing SDK from ' + branch +' branch, this may take a little time :)');
                exec('appc ti sdk install --branch ' + branch + ' -d', function(err, stdout, stderr){
                    if(err){cb(err);}
                    if(!!~stdout.indexOf('successfully installed!')){
                        var version = stdout.match(/Titanium SDK \d+\.\d+\.\d+(.GA|.v\d{14})/);
                        console.log(version);
                        console.log(version + ' installed');
                        cb();
                    }
                });
            }else{
                console.log('Installing SDK ' + sdk + ' , this may take a little time :)');
                exec('appc ti sdk install ' + sdk + ' -d', function(err, stdout, stderr){
                    if(!!~stdout.indexOf('successfully installed!')){
                        if(err){cb(err);}
                        var version = stdout.match(/Titanium SDK \d+\.\d+\.\d+(.GA|.v\d{14})/);
                        console.log(version);
                        console.log(version + ' installed');
                        cb();
                    }
                });
            }
        }
    ]);
};
