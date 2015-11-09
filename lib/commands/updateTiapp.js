var colors = require("colors"),
		path = require("path");

module.exports = function(sdk, projectDir){
	try{
		var valid = /(\d+\.\d+\.\d+(.GA|.v\d{14}))/.test(sdk);
		if(valid){
			var tiappLoc = projectDir === undefined ? path.join(__dirname, "tiapp.xml") : path.join(projectDir, "tiapp.xml");
			var tiapp = require('tiapp.xml').load(tiappLoc);
			tiapp.sdkVersion = sdk;
			tiapp.write();
			console.log("tiapp.xml at location %s has been updated to SDK version %s", tiappLoc, sdk);
		}else{
			console.log("%s is not valid SDK", sdk);
		}
	}catch(e){
		console.log("Can't find a tiapp.xml. Are you sure this is a valid project?");
	}
};