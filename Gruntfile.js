/*jshint node: true, browser: false */
module.exports = function (grunt) {

	'use strict';

	// Load all installed plugins
	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// Configuration
	var port = grunt.option('port') || 4000;

	// Configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		connect: {
			server: {
				options: {
					hostname: '*',
					port: port,
					livereload: true,
					open: {
						target: 'http://localhost:' + port + '/src/'
					},
					middleware: function (connect, options) {
						if (!Array.isArray(options.base)) {
							options.base = [options.base];
						}

						// Setup the proxy
						var middlewares = [require('grunt-connect-proxy/lib/utils').proxyRequest];

						// Serve static files
						options.base.forEach(function (base) {
							middlewares.push(connect.static(base));
						});

						// Make directory browse-able
						var directory = options.directory || options.base[options.base.length - 1];
						middlewares.push(connect.directory(directory));

						return middlewares;
					}
				}
			}
		},
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
		},
		jshint: {
			options: {
				jshintrc: true
			},
			all: ['**/*.js', '!node_modules/**/*', '!bower_components/**/*']
		},
		jsonlint: {
			all: {
				src: ['**/*.json', '!node_modules/**/*', '!bower_components/**/*']
			}
		},
		lintspaces: {
			all: {
				src: ['**/*.{js,less,html}', '!node_modules/**/*', '!bower_components/**/*'],
				options: {
					newline: true,
					trailingspaces: true,
					indentation: 'tabs',
					ignores: ['js-comments']
				}
			}
		}
	});

	// Tasks
	grunt.registerTask('default', ['serve']);
	grunt.registerTask('serve', ['connect', 'watch']);
	grunt.registerTask('build', ['lint']);
	grunt.registerTask('lint', ['jshint', 'lintspaces']);
	grunt.registerTask('release', function (bump) {
		// If no 'bump' argument was provided, set it to 'patch'
		if (arguments.length === 0) {
			bump = 'patch';
		}

		// Bump the appropriate version piece, build the dist folder, and commit it all up
		grunt.task.run('test', 'bump-only:' + bump, 'compile', 'bump-commit');
	});

};
