/*global module:false*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
    },
    concat: {
      dist_js: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/jquery.coords.js>', '<file_strip_banner:src/jquery.collision.js>', 'src/utils.js', '<file_strip_banner:src/jquery.draggable.js>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
        dest: 'dist/<%= pkg.name %>.js'
      },

      dist_extras_js: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/jquery.coords.js>', '<file_strip_banner:src/jquery.collision.js>', 'src/utils.js', '<file_strip_banner:src/jquery.draggable.js>', '<file_strip_banner:src/<%= pkg.name %>.js>', '<file_strip_banner:src/<%= pkg.name %>.extras.js>'],
        dest: 'dist/<%= pkg.name %>.with-extras.js'
      },

      dist_css: {
        src: ['<banner:meta.banner>', 'src/<%= pkg.name %>.css'],
        dest: 'dist/<%= pkg.name %>.css'
      },

      dist_demo_js: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/jquery.coords.js>', '<file_strip_banner:src/jquery.collision.js>', 'src/utils.js', '<file_strip_banner:src/jquery.draggable.js>', '<file_strip_banner:src/<%= pkg.name %>.js>'],
        dest: 'gh-pages/dist/<%= pkg.name %>.js'
      },

      dist_extras_demo_js: {
        src: ['<banner:meta.banner>', '<file_strip_banner:src/jquery.coords.js>', '<file_strip_banner:src/jquery.collision.js>', 'src/utils.js', '<file_strip_banner:src/jquery.draggable.js>', '<file_strip_banner:src/<%= pkg.name %>.js>', '<file_strip_banner:src/<%= pkg.name %>.extras.js>'],
        dest: 'gh-pages/dist/<%= pkg.name %>.with-extras.js'
      },

      dist_demo_css: {
        src: ['<banner:meta.banner>', 'src/<%= pkg.name %>.css'],
        dest: 'gh-pages/dist/<%= pkg.name %>.css'
      }
    },
    min: {
      dist: {
        src: ['<banner:meta.banner>', '<config:concat.dist_js.dest>'],
        dest: 'dist/<%= pkg.name %>.min.js'
      },

      dist_extras: {
        src: ['<banner:meta.banner>', '<config:concat.dist_extras_js.dest>'],
        dest: 'dist/<%= pkg.name %>.with-extras.min.js'
      },

      dist_demo: {
        src: ['<banner:meta.banner>', '<config:concat.dist_js.dest>'],
        dest: 'gh-pages/dist/<%= pkg.name %>.min.js'
      },

      dist_extras_demo: {
        src: ['<banner:meta.banner>', '<config:concat.dist_extras_js.dest>'],
        dest: 'gh-pages/dist/<%= pkg.name %>.with-extras.min.js'
      }
    },
    mincss: {
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
    lint: {
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
    uglify: {},
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

  // Default task.
  grunt.registerTask('default', 'lint qunit concat min mincss yuidoc');

};
