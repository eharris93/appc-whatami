exports.define = function(program){
  var subCommands = [
    'env-info',
    'get-latest',
    'switch-env',
    'update-tiapp'
  ];
  for (var i = 0; i < subCommands.length; i++) {
		require('./' + subCommands[i]).define(program);
	}
};
