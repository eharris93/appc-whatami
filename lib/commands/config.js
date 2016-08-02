'use strict';

var _ = require('lodash');
var colors = require('colors');
var util = require('../util.js');
var fs = require('fs-extra');
var dots = require('dot-notes');


var config = function config (action, key, value, callback) {
  var configDir = util.configDir();
  var configFile = util.configFile();
  var obj;
  var output;
  var isSync = !_.isFunction(callback);

  action = _.isFunction(action) || !action ? 'list' : action;
  key = _.isFunction(key) ? null : key;
  value = _.isFunction(value) ? null : value;

  try {
    obj = JSON.parse(fs.readFileSync(configFile));
  } catch(e) {
    obj = {};
  }

  switch(action) {
    case 'list':
      output = '';
      for(var objKey in obj) {
        if (obj.hasOwnProperty(objKey)) {
          var val = obj[objKey],
            line = objKey.cyan.underline + ': ';
          if (_.isObject(val)) {
            line += '\n' + JSON.stringify(val, null, '\t');
          } else {
            line += val;
          }
          output += line + '\n';
        }
      }
      break;

    case 'get':
      if (!key) {
        console.log('No key provided!'.red);
        break;
      }

      var configValue = dots.get(obj, key);
      if (configValue) {
        output = configValue;
      } else {
        isSync ? console.log('Key '.red + key.cyan.underline + ' does not exist'.red) : '';
      }
      break;

    case 'set':
      if (!key) {
        isSync ? console.log('No key provided!'.red) : '';
        break;
      }
      if(!value) {
        dots.create(obj, key, '');
        fs.ensureDirSync(configDir);
        fs.writeFileSync(configFile, JSON.stringify(obj, null, 2));
        output = 'Set ' + key.cyan.underline + ' to ' +  (value === null ? 'null'.cyan.underline : value.cyan.underline);
      } else {
        dots.create(obj, key, value);
        fs.ensureDirSync(configDir);
        fs.writeFileSync(configFile, JSON.stringify(obj, null, 2));
        output = 'Set ' + key.cyan.underline + ' to ' +  (value === null ? 'null'.cyan.underline : value.cyan.underline);
        break;
      }
  }
  return isSync ? output : callback(null, output);
};

['get', 'set', 'list'].forEach(function (action) {
  config[action] = function () {
    return config.apply(config, [action].concat(Array.prototype.slice.apply(arguments)));
  };
});

module.exports = config;
