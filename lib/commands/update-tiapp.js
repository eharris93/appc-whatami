var async = require('async'),
	colors = require('colors'),
	fields = require('fields'),
	fs = require('fs'),
	path = require('path'),
	util = require('../util.js');

module.exports = function(sdk, projectDir){
	var installedSDKs;
	async.series([
		function(cb){
			 util.getInstalledSDK(function(err, result){
				 if(err){cb(err);}
			 	installedSDKs = result;
			 	cb();
			 });
		},
		function(cb){
			var toAsk = {};
			if(sdk === undefined || !util.validateSDKVersion(sdk)){
				var opts = {
					'Installed':[
					]
				};
				for(var i in installedSDKs){
					opts.Installed.push({'name': i, 'value':i});
				}
				toAsk.sdk  = fields.select({
					title: 'What SDK to use?',
					formatters: {
				    	option: function (opt, idx, num) {
							return '    ' + num + opt.value.cyan;
				        }
				    },
						numbered: true,
				    relistOnError: true,
				    complete: true,
				    options: opts
				});
			}
			if(projectDir === undefined){
				toAsk.projectDir = fields.file({
					title: 'What\'s the location of the project',
					complete: true,
					ignoreDirs: /^(\.svn|\.git|\.hg)$'/,
    				ignoreFiles: /^(\.gitignore|\.npmignore|\.cvsignore|\.DS_store|\._\*)$/,
    				default: process.cwd(),
    				validate: function(projDir, cb){
    					if(projectDir === ''){
    						return cb();
    					}
    					projDir = util.resolvePath(projDir);
    					if(!fs.existsSync(projDir) || !fs.statSync(projDir).isDirectory()){
    						return cb(new Error('That\'s not a valid directory!'));
    					}

    					var tiappLoc = path.join(projDir, 'tiapp.xml');
							console.log(tiappLoc);

    					if(!fs.existsSync(tiappLoc)){
    						return cb(new Error('That directory does not have a tiapp.xml!'));
    					}

    					cb(null,projDir);
    				}
				});
			}
			fields.set(toAsk).prompt(function (err, value) {
			    if (err) {
			        console.error('There was an error!\n' + err);
			    } else {
			        if(toAsk.sdk){
			        	sdk = value.sdk;
			        }
			        if(toAsk.projectDir){
			        	projectDir = value.projectDir;
			        }
			        cb();
			    }
			});
		},
		function(cb){
			if(util.validateSDKVersion(sdk)){
				try{
					var tiappLoc = path.join(projectDir, 'tiapp.xml');
					var tiapp = require('tiapp.xml').load(tiappLoc);
					tiapp.sdkVersion = sdk;
					tiapp.write();
					console.log('tiapp.xml at location %s has been updated to SDK version %s', tiappLoc.magenta, sdk.magenta);
				}catch(e){
					console.log(e);
					console.log('Can\'t find a tiapp.xml. Are you sure this is a valid project?');
				}
			}
		}
	]);
};
