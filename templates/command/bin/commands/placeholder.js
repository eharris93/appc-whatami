'use strict';

var <%= name.replace(/\W/g, '') %>Command = require('../../lib/commands/<%= name %>');

exports.define = function (program) {
  program
    .command('<%= name %>')
    .description('<%= description %>')
    .action(function (command) {
      <%= name.replace(/\W/g, '') %>Command();
    });
};
