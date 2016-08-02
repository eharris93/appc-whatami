module.exports = function (grunt) {
	// Project configuration.
  require('load-grunt-tasks')(grunt);

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
