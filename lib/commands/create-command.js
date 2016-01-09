'use strict';

var colors = require('colors');
var path = require('path');
var async = require('async');
var fs = require('fs-extra');
var fields = require('fields');
var recursive = require('recursive-readdir');
var ejs = require('ejs');

module.exports = function (name, description) {
  var opts = {};
  async.series([
    function (cb) {
      var toAsk = {};
      if (name === undefined) {
        toAsk.name = fields.text({
          title: 'What would you like the name of the command to be?',
          validate: function (value, callback) {
            callback(!value.length && new Error('Please enter a name'), value);
          }
        });
      }
      if (description === undefined) {
        toAsk.description = fields.text({
          title: 'What would you like the description of the command to be?',
          validate: function (value, callback) {
            callback(!value.length && new Error('Please enter a description'), value);
          }
        });
      }

      fields.set(toAsk).prompt(function (err, value) {
        if (err) {
          console.error('There was an error!\n' + err);
        } else {
          if (toAsk.name) {
            name = value.name;
          }

          if (toAsk.description) {
            description = value.description;
          }
          cb();
        }
        opts.name = name;
        opts.description = description;
      });
    },
    function (cb) {

      var templateDir = path.join(__dirname, '..','..', 'templates', 'command');
      var targetDir = path.join(__dirname, '..', '..');
      if (!fs.existsSync(templateDir)) {
        return cb(new Error('The template directory does not exist.'));
      }
      //Copy the template over
      fs.copySync(templateDir, targetDir);

      var bin = path.join(targetDir, 'bin/commands/');
      var lib = path.join(targetDir, 'lib/commands/');

      //The files will always be in the same place so we'll just hardcode them
      var files = [];
      files.push(path.join(bin, 'placeholder.js'));
      files.push(path.join(lib, 'placeholder.js'));
      files.forEach(function (file) {
        fs.writeFileSync(file, ejs.render(fs.readFileSync(file, 'utf8'), opts));
      });

      // //Rename the file
      fs.renameSync(path.join(bin, 'placeholder.js'), path.join(bin, opts.name + '.js'));
      fs.renameSync(path.join(lib, 'placeholder.js'), path.join(lib, opts.name + '.js'));

      // //Add the command to the array of commands
      var subCommands = JSON.parse(fs.readFileSync(path.join(targetDir, 'bin', 'commands', 'subcommands.json')));
      subCommands.subcommands.push(name);
      fs.writeFileSync(path.join(targetDir, 'bin', 'commands', 'subcommands.json'), JSON.stringify(subCommands));
      cb();
    }
  ]);
};
