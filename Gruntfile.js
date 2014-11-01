module.exports = function ( grunt ) {

	require('load-grunt-tasks')(grunt);

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		meta: {
			banner: '/*! <%= pkg.name %> <%= pkg.version %> - <%= pkg.description %> | Author: <%= pkg.author %>, <%= grunt.template.today("yyyy") %> | License: <%= pkg.license %> */\n'
		},

		watch: {
			browserify: {
				files: ['app/scripts/hascheck.js'],
				tasks: ['browserify']
			},
			sass: {
				files: ['app/styles/hascheck.scss'],
				tasks: ['sass']
			}
		},

		browserify: {
			dist: {
				options: {
					transform: ['debowerify']
				},
				files: {
					'app/scripts/out/hascheck.js': ['app/scripts/hascheck.js']
				},
			}
		},

		sass: {
			dist: {
				options: {
					loadPath: ['bower_components'],
					sourcemap: 'none',
					style: 'compressed',
					banner: '<%= meta.banner %>'
				},
				files: {
					'app/styles/out/hascheck.css': ['app/styles/hascheck.scss']
				}
			}
		},

		autoprefixer: {
			dist: {
				options: {
					browsers: ['last 1 Chrome versions']
				},
				src: 'app/styles/out/hascheck.css',
				dest: 'app/styles/out/hascheck.css'
			},
		},

		uglify: {
			dist: {
				options: {
					compress: false,
					mangle: false,
					banner: '<%= meta.banner %>'
				},
				files: {
					'app/scripts/out/hascheck.js': ['app/scripts/out/hascheck.js']
				}
			}
		},

		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: 'app/images/',
					src: ['**/*.{png,jpg,gif}'],
					dest: 'app/images/'
				}]
			}
		},

		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: 'app/images/',
					src: ['**/*.svg'],
					dest: 'app/images/'
				}]
			}
		},

		jscs: {
			main: {
				options: {
					config: '.jscsrc'
				},
				files: {
					src: [
						'app/**/*.js',
						'!app/**/out/*.js'
					]
				}
			}
		},

		jshint: {
			main: {
				options: {
					jshintrc: '.jshintrc'
				},
				src: [
					'app/**/*.js',
					'!app/**/out/*.js'
				]
			}
		},

		bump: {
			options: {
				files: ['package.json', 'bower.json', 'app/manifest.json'],
				updateConfigs: ['pkg'],
				commit: true,
				commitMessage: 'Release %VERSION%',
				commitFiles: ['-a'],
				createTag: true,
				tagName: '%VERSION%',
				tagMessage: '',
				push: false
			}
		},

		clean: {
			dist: ['dist/', 'package/']
		},

		copy: {
			dist: {
				files: [{
					expand: true,
					cwd: 'app/',
					src: [
						'**',
						'!**/scripts/hascheck.js',
						'!**/styles/hascheck.scss'
					],
					dest: 'dist/',
				}]
			}
		},

		compress: {
			dist: {
				options: {
					archive: function() {
						var manifest = grunt.file.readJSON('app/manifest.json');
						return 'package/Hascheck for Chrome-' + manifest.version + '.zip';
					}
				},
				files: [{
					expand: true,
					cwd: 'dist/',
					src: ['**'],
					dest: ''
				}]
			}
		}

	});

	grunt.registerTask('stylecheck', ['jshint:main', 'jscs:main']);
	grunt.registerTask('default', ['stylecheck','browserify','uglify','sass','autoprefixer','imagemin','svgmin','clean','copy','compress']);
	grunt.registerTask('releasePatch', ['bump-only:patch', 'default', 'bump-commit']);
	grunt.registerTask('releaseMinor', ['bump-only:minor', 'default', 'bump-commit']);
	grunt.registerTask('releaseMajor', ['bump-only:major', 'default', 'bump-commit']);

};
