'use strict';

var getLatestCommand = require('../../lib/commands/get-latest.js');

exports.define = function (program) {
  program
    .command('get-latest')
    .description('Get the latest for appc-cli (core and npm) and ti SDK. Versions can be specified for appc-cli, branch or version for ti sdk')
    .option('-n --npm [npm]', 'Install the latest NPM or specify the version for the appc-cli npm package')
    .option('-c --core [core]', 'Install the latest core or specifythe version for the appc-cli core package')
    .option('-s --sdk [sdk]', 'Install the latest SDK or specify the specific SDK to install, overrides --branch')
    .option('-b --branch [branch]', 'the branch to pull from for the SDK')
    .parse(process.argv)
    .on('--help', function () {
      console.log('Examples:\n');
      console.log('\tqe get-latest -c -n \t\t   This will install the latest version of core and NPM');
      console.log('\tqe get-latest -c 5.1.1 -n \t   This will install 5.1.1 version of core and the latest NPM');
      console.log('\tqe get-latest -s 5.1.1.GA -n 4.0.0 This will install the 5.1.1.GA version of SDK and 4.0.0 NPM');
    })
    .action(function (command) {
      getLatestCommand(command.npm, command.core, command.sdk, command.branch);
    });
};
