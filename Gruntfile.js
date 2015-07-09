/*jshint node: true, browser: false */
module.exports = function (grunt) {

	'use strict';

	// Load all installed plugins
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bump: {
			options: {
				files: ['package.json', 'bower.json'],
				updateConfigs: ['pkg'],
				commit: true,
				commitMessage: 'Version %VERSION%',
				commitFiles: ['package.json', 'bower.json'],
				createTag: true,
				tagName: 'v%VERSION%',
				tagMessage: 'Version %VERSION%',
				push: true,
				pushTo: 'origin'
			}
		}
	});

	// Tasks
	grunt.registerTask('release', function (bump) {
		// If no 'bump' argument was provided, set it to 'patch'
		if (arguments.length === 0) {
			bump = 'patch';
		}

		// Bump the appropriate version piece, build the dist folder, and commit it all up
		grunt.task.run('bump-only:' + bump, 'bump-commit');
	});

};
