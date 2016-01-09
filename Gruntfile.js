module.exports = function (grunt) {
	// Project configuration.
  require('load-grunt-tasks')(grunt); // npm install --save-dev load-grunt-tasks

  grunt.initConfig({
    eslint: {
      config: '.eslintrc.js',
      target: [
        'Gruntfile.js',
        'bin/commands/*.js',
        'lib/**'
      ]
    }
  });

  grunt.registerTask('default', ['eslint']);
};
