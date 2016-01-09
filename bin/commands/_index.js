'use strict';
var subCommands = require('./subcommands.json').subcommands;

exports.define = function (program) {
  for (var i = 0; i < subCommands.length; i++) {
    require('./' + subCommands[i]).define(program);
  }
};
