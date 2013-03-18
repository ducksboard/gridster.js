/*global module:false*/
module.exports = function(grunt) {

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
        src: ['src/jquery.coords.js', 'src/jquery.collision.js', 'src/utils.js', 'src/jquery.draggable.js', 'src/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },

      dist_extras_js: {
        src: ['src/jquery.coords.js', 'src/jquery.collision.js', 'src/utils.js', 'src/jquery.draggable.js', 'src/<%= pkg.name %>.js', 'src/<%= pkg.name %>.extras.js'],
        dest: 'dist/<%= pkg.name %>.with-extras.js'
      },

      dist_css: {
        src: ['src/<%= pkg.name %>.css'],
        dest: 'dist/<%= pkg.name %>.css'
      },

      dist_demo_js: {
        src: ['src/jquery.coords.js', 'src/jquery.collision.js', 'src/utils.js', 'src/jquery.draggable.js', 'src/<%= pkg.name %>.js'],
        dest: 'gh-pages/dist/<%= pkg.name %>.js'
      },

      dist_extras_demo_js: {
        src: ['src/jquery.coords.js', 'src/jquery.collision.js', 'src/utils.js', 'src/jquery.draggable.js', 'src/<%= pkg.name %>.js', 'src/<%= pkg.name %>.extras.js'],
        dest: 'gh-pages/dist/<%= pkg.name %>.with-extras.js'
      },

      dist_demo_css: {
        src: ['src/<%= pkg.name %>.css'],
        dest: 'gh-pages/dist/<%= pkg.name %>.css'
      }
    },
    uglify: {
      options: {
        banner: '<%= meta.minibanner %>'
      },
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['<%= concat.dist_js.dest %>']
        }
      },

      dist_extras: {
        files: {
          'dist/<%= pkg.name %>.with-extras.min.js': ['<%= concat.dist_extras_js.dest %>']
        }
      },

      dist_demo: {
        files: {
          'gh-pages/dist/<%= pkg.name %>.min.js': ['<%= concat.dist_js.dest %>'],
        }
      },

      dist_extras_demo: {
        files: {
          'gh-pages/dist/<%= pkg.name %>.with-extras.min.js': ['<%= concat.dist_extras_js.dest %>']
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
          "dist/<%= pkg.name %>.min.css": ["dist/<%= pkg.name %>.css"],
          "gh-pages/dist/<%= pkg.name %>.min.css": ["dist/<%= pkg.name %>.css"]
        }
      }
    },
    jshint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: ['<%= lint.files %>', 'src/<%= pkg.name %>.css'],
      tasks: 'min concat'
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },
      globals: {
        jQuery: true
      }
    },
    yuidoc: {
      compile: {
        "name": 'gridster.js',
        "description": 'gridster.js, a drag-and-drop multi-column jQuery grid plugin',
        "version": '0.1.0',
        "url": 'http://gridster.net/',
        "logo": 'http://ducksboard.com/wp-content/themes/blog-theme-ducksboard/images/ducksboard.png',
        options: {
          paths: "src/",
          outdir: "gh-pages/docs/"
        }
      }
    }
  });

  // grunt.loadNpmTasks('grunt-contrib');

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-yuidoc');

  // Default task.
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin', 'yuidoc']);

};