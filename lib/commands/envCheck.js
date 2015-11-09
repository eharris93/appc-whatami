var colors = require("colors"),
	path = require("path"),
	async = require("async")
	exec = require("child_process").exec,
	fs = require("fs");

module.exports = function(){
  var env = {};
  async.parallel([
	  function(cb){
		exec("appc -v -o json", function(err, stdout, stderr){
		  env.appcCore = JSON.parse(stdout).CLI;
		  env.appcNpm = JSON.parse(stdout).NPM;
		  cb();
		});
	  },
	  function(cb){
		exec("appc ti sdk -o json", function(err, stdout, stderr){
		  env.sdk = JSON.parse(stdout).activeSDK;
		  cb();
		});
	  },
	  function(cb){
		exec("node -v", function(err, stdout, stderr){
		  env.node = stdout.trim();
		  cb();
		});
	  },
	  function(cb){
		exec("npm -v", function(err, stdout, stderr){
		  env.npm = stdout.trim();
		  cb();
		});
	  },
	  function(cb){
		var osInfo = {};
		switch(process.platform){
		  case "darwin":
			exec("sw_vers", function(err, stdout, stderr){
			   osInfo.name = stdout.match(/ProductName:\s+(.+)/i)[1];
			   osInfo.version = stdout.match(/ProductVersion:\s+(.+)/i)[1];
			   env.os = osInfo;
			   cb();
			});
			break;
		  case "win32":
			exec('wmic os get Caption,Version', function (err, stdout, stderr) {
				var s = stdout.split('\n')[1].split(/ {2,}/);
				osInfo.name = s[0].trim();
				osInfo.version = s[1].trim();
				env.os = osInfo;
				cb();
			});
			break;
		}
	  },
	  function(cb){
		switch(process.platform){
		  case "darwin":
			  try{
				var versionFile = fs.readFile("/Applications/Appcelerator Studio/version.txt", "utf-8", function(err, data){
					env.studio = data.match(/!define VERSION (\d+\.\d+\.\d\.\d{12})/)[1];
					cb();
				});
			  }catch(e){
				console.log(e);
				cb();
			  }
			break;
		  case "win32":
			try{
			  var file = path.join(process.env.USERPROFILE, "AppData", "Roaming", "Appcelerator", "Appcelerator Studio", "version.txt");
			  fs.readFile(file, "utf-8", function(err, data){
				  env.studio = data.match(/!define VERSION (\d+.\d+.\d.\d{12})/)[1];
			  });
			}catch(e){
			  console.log(e);
			  cb();
			}
			cb();
			break;
		}
	  }
	], function(){
	  console.log("Environment information:")
	  console.log("OS: %s %s", env.os.name.cyan, env.os.version.cyan);
	  console.log("Appc core: %s", env.appcCore.cyan);
	  console.log("Appc NPM: %s", env.appcNpm.cyan);
	  console.log("Ti SDK: %s", env.sdk.cyan);
	  console.log("Appc Studio: %s", env.studio.cyan)
	  console.log("Node: %s", env.node.cyan);
	  console.log("NPM: %s", env.npm.cyan);
	})
}