var colors = require("colors"),
		async = require("async"),
		exec = require("child_process").exec;

function switchEnv(environment, username, password, orgId){
	async.series([
		function(cb){
			console.log("Logging out");
			exec("appc logout", function(err, stdout, stderr){
					if(err){cb(err);}
					cb();
			});
		},
		function(cb){
			console.log("Setting defaultEnvironment to %s", environment);
			exec("appc config set defaultEnvironment " + environment, function(err, stdout, stderr){
					if(err){cb(err);}
					if(!!~stdout.indexOf("defaultEnvironment")){
						cb();
					}
			});
		},
		function(cb){
			console.log("Logging in to account %s", username);
			exec("appc login --username " + username + " --password " + password + " --org-id " + orgId, function(err, stdout, stderr){
				if(err){cb(err);}
				if(!!~stdout.indexOf("logged into organization")){
					console.log("You have been logged in to %s environment, enjoy your day!", environment);
					cb();
				}
			});
		}
	]);
}

module.exports = function(environment, username, password, orgId){

	var validEnvs = ["prod", "production", "preprod", "preproduction"];
	switch(environment){
			case "prod":
			case "production":
				switchEnv("production", username, password, orgId);
				break;
			case "preprod":
			case "preproduction":
				switchEnv("preproduction", username, password, orgId);
				break;
			default:
				console.log("%s is not a valid environment. Please choose one of the following:", environment.red);
				console.log("\t" + validEnvs.join('\n \t').cyan);
		}
}