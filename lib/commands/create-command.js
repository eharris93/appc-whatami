'use strict';

var async = require('async');
var colors = require('colors');
var ejs = require('ejs');
var fs = require('fs-extra');
var inquirer = require('inquirer');
var path = require('path');
var opts = {};
module.exports = function (name, description) {
  async.series([
    function (cb) {
      var toAsk = [];
      if (name === undefined) {
        toAsk.push({
          type: 'input',
          name: 'name',
          message: 'What would you like the name of the command to be?',
          validate: function (value) {
            var valid = !!value.length;
            return valid || 'Please enter a name';
          }
        });
      }
      if (description === undefined) {
        toAsk.push({
          type: 'input',
          name: 'description',
          message: 'What would you like the description of the command to be?',
          validate: function (value) {
            var valid = !!value.length;
            return valid || 'Please enter a description';
          }
        });
      }

      inquirer.prompt(toAsk).then(function (answers) {
        if (answers.name) {
          name = answers.name;
        }

        if (answers.description) {
          description = answers.description;
        }
        opts.name = name;
        opts.description = description;
        cb();
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
      console.log(opts);
      files.forEach(function (file) {
        fs.writeFileSync(file, ejs.render(fs.readFileSync(file, 'utf8'), opts));
      });

      // //Rename the file
      fs.renameSync(path.join(bin, 'placeholder.js'), path.join(bin, opts.name + '.js'));
      fs.renameSync(path.join(lib, 'placeholder.js'), path.join(lib, opts.name + '.js'));

      // //Add the command to the array of commands
      var subCommands = JSON.parse(fs.readFileSync(path.join(targetDir, 'bin', 'commands', 'subcommands.json')));
      subCommands.subcommands.push(opts.name);
      fs.writeFileSync(path.join(targetDir, 'bin', 'commands', 'subcommands.json'), JSON.stringify(subCommands));
      cb();
    }
  ]);
};
