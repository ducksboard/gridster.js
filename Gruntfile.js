/*global module:false*/
module.exports = function(grunt) {

  var mocha_options = {
    // mocha options
    mocha: {
      ignoreLeaks: false
    },
    reporter: 'Spec',
    // Indicates whether 'mocha.run()' should be executed in 'bridge.js'
    run: true
  };

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
              '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
              '<%= pkg.homepage ? "* " + pkg.homepage : "" %>\n' +
              '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
              ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n\n',

      minibanner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                  '<%= grunt.template.today("yyyy-mm-dd") %> - ' +
                  '<%= pkg.homepage ? "* " + pkg.homepage + " - " : "" %>' +
                  'Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                  ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */ '
    },
    concat: {
      options: {
        stripBanners: true,
        banner: '<%= meta.banner %>'
      },
      dist_js: {
        src: ['src/jquery.coords.js', 'src/jquery.collision.js', 'src/utils.js', 'src/jquery.draggable.js', 'src/jquery.<%= pkg.name %>.js'],
        dest: 'dist/jquery.<%= pkg.name %>.js'
      },

      dist_extras_js: {
        src: ['src/jquery.coords.js', 'src/jquery.collision.js', 'src/utils.js', 'src/jquery.draggable.js', 'src/jquery.<%= pkg.name %>.js', 'src/jquery.<%= pkg.name %>.extras.js'],
        dest: 'dist/jquery.<%= pkg.name %>.with-extras.js'
      },

      dist_css: {
        src: ['src/jquery.<%= pkg.name %>.css'],
        dest: 'dist/jquery.<%= pkg.name %>.css'
      },

      dist_demo_js: {
        src: ['src/jquery.coords.js', 'src/jquery.collision.js', 'src/utils.js', 'src/jquery.draggable.js', 'src/jquery.<%= pkg.name %>.js'],
        dest: 'gh-pages/dist/jquery.<%= pkg.name %>.js'
      },

      dist_extras_demo_js: {
        src: ['src/jquery.coords.js', 'src/jquery.collision.js', 'src/utils.js', 'src/jquery.draggable.js', 'src/jquery.<%= pkg.name %>.js', 'src/jquery.<%= pkg.name %>.extras.js'],
        dest: 'gh-pages/dist/jquery.<%= pkg.name %>.with-extras.js'
      },

      dist_demo_css: {
        src: ['src/jquery.<%= pkg.name %>.css'],
        dest: 'gh-pages/dist/jquery.<%= pkg.name %>.css'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.minibanner %>'
      },
      dist: {
        files: {
          'dist/jquery.<%= pkg.name %>.min.js': ['<%= concat.dist_js.dest %>']
        }
      },

      dist_extras: {
        files: {
          'dist/jquery.<%= pkg.name %>.with-extras.min.js': ['<%= concat.dist_extras_js.dest %>']
        }
      },

      dist_demo: {
        files: {
          'gh-pages/dist/jquery.<%= pkg.name %>.min.js': ['<%= concat.dist_js.dest %>'],
        }
      },

      dist_extras_demo: {
        files: {
          'gh-pages/dist/jquery.<%= pkg.name %>.with-extras.min.js': ['<%= concat.dist_extras_js.dest %>']
        }
      }
    },
    cssmin: {
      compress: {
        options: {
          keepSpecialComments: 0,
          banner: '<%= meta.minibanner %>'
        },
        files: {
          "dist/jquery.<%= pkg.name %>.min.css": ["dist/jquery.<%= pkg.name %>.css"],
          "gh-pages/dist/jquery.<%= pkg.name %>.min.css": ["dist/jquery.<%= pkg.name %>.css"]
        }
      }
    },
    jshint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },

    watch: {
      files: ['<%= lint.files %>', 'src/jquery.<%= pkg.name %>.css'],
      tasks: 'min concat'
    },

    yuidoc: {
      compile: {
        "name": 'gridster.js',
        "description": 'gridster.js, a drag-and-drop multi-column jQuery grid plugin',
        "version": '0.1.0',
        "url": 'http://gridster.net/',
        "logo": 'https://ducksboard.com/static/images/svg/logo-ducksboard-black-small.svg',
        options: {
          paths: "src/",
          outdir: "gh-pages/docs/"
        }
      }
    },

    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'CHANGELOG.md', 'dist/'], // '-a' for all files
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d' // options to use with '$ git describe'
      }
    },

    changelog: {
        options: {
            dest: 'CHANGELOG.md'
        }
    },

    mocha: {
      // runs all html files (except test2.html) in the test dir
      // In this example, there's only one, but you can add as many as
      // you want. You can split them up into different groups here
      // ex: admin: [ 'test/admin.html' ]
      // all: ['test/**/!(test2).html'],

      coords: {
        src: ['test/coords.html'],
        options: mocha_options
      },
      collision: {
        src: ['test/collision.html'],
        options: mocha_options
      }
    },

    watch: {
      files: ['libs/*.js', 'src/*.js', 'src/*.css', 'Gruntfile.js'],
      tasks: ['concat', 'uglify', 'cssmin']
    }
  });


  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-conventional-changelog');
  grunt.loadNpmTasks('grunt-mocha');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin']);
  grunt.registerTask('build', ['default']);
  grunt.registerTask('docs', ['yuidoc']);
  grunt.registerTask('test', ['mocha:coords', 'mocha:collision']);

  grunt.registerTask('release', ['build', 'bump-only:patch', 'build', 'docs', 'changelog']);
  grunt.registerTask('release:minor', ['build', 'bump-only:minor', 'build', 'docs', 'changelog']);
  grunt.registerTask('release:major', ['build', 'bump-only:major', 'build', 'docs', 'changelog']);
  grunt.registerTask('release:git', ['build', 'bump-only:git', 'build', 'docs', 'changelog', 'bump-commit']);
  grunt.registerTask('release:commit', ['bump-commit']);

};
