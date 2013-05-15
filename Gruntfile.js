/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      dist_js: {
        src: ['<banner:meta.banner>', 'src/jquery.coords.js', 'src/jquery.collision.js', 'src/utils.js', 'src/jquery.draggable.js', 'src/<%= pkg.name %>.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },

      dist_extras_js: {
        src: ['<banner:meta.banner>', 'src/jquery.coords.js', 'src/jquery.collision.js', 'src/utils.js', 'src/jquery.draggable.js', 'src/<%= pkg.name %>.js', 'src/<%= pkg.name %>.extras.js'],
        dest: 'dist/<%= pkg.name %>.with-extras.js'
      },

      dist_css: {
        src: ['<banner:meta.banner>', 'src/<%= pkg.name %>.css'],
        dest: 'dist/<%= pkg.name %>.css'
      },

      dist_demo_js: {
        src: ['<banner:meta.banner>', 'src/jquery.coords.js', 'src/jquery.collision.js', 'src/utils.js', 'src/jquery.draggable.js', 'src/<%= pkg.name %>.js'],
        dest: 'gh-pages/dist/<%= pkg.name %>.js'
      },

      dist_extras_demo_js: {
        src: ['<banner:meta.banner>', 'src/jquery.coords.js', 'src/jquery.collision.js', 'src/utils.js', 'src/jquery.draggable.js>', 'src/<%= pkg.name %>.js', 'src/<%= pkg.name %>.extras.js'],
        dest: 'gh-pages/dist/<%= pkg.name %>.with-extras.js'
      },

      dist_demo_css: {
        src: ['<banner:meta.banner>', 'src/<%= pkg.name %>.css'],
        dest: 'gh-pages/dist/<%= pkg.name %>.css'
      }
    },
    uglify: {
      dist: {
        files: {
          'dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      },

      dist_extras: {
        files: {
          'dist/<%= pkg.name %>.with-extras.min.js': ['dist/<%= pkg.name %>.with-extras.js']
        }
      },

      dist_demo: {
        files: {
          'gh-pages/dist/<%= pkg.name %>.min.js': ['dist/<%= pkg.name %>.js']
        }
      },

      dist_extras_demo: {
        files: {
          'gh-pages/dist/<%= pkg.name %>.with-extras.min.js': ['dist/<%= pkg.name %>.with-extras.js']
        }
      }
    },
    cssmin: {
      compress: {
        files: {
          "dist/<%= pkg.name %>.min.css": ["dist/<%= pkg.name %>.css"],
          "gh-pages/dist/<%= pkg.name %>.min.css": ["dist/<%= pkg.name %>.css"]
        }
      }
    },
    qunit: {
      files: ['test/**/*.html']
    },
    jslint: {
      files: ['grunt.js', 'src/**/*.js', 'test/**/*.js']
    },
    watch: {
      files: ['<config:lint.files>', 'src/<%= pkg.name %>.css'],
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

  grunt.loadNpmTasks('grunt-contrib');
  grunt.loadNpmTasks('grunt-jslint');

  // Default task.
  grunt.registerTask('default', ['jslint', 'qunit', 'concat', 'uglify', 'cssmin', 'yuidoc']);

};