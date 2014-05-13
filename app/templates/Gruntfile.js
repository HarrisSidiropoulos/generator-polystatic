module.exports = function (grunt) {
  "use strict";

  var copyPathToDrupalTheme = '../drupal_site/sites/all/themes/mega/assets/';
  var production = true;

  grunt.initConfig({
    sass: {
      dist: {
        files: {
          "static/assets/css/styles.css": "static/assets/sass/styles.scss"
        }
      }
    },
    autoprefixer: {
      build: {
        options: {
          browsers: ['last 2 versions', '> 1%']
        },
        files: [
          {
            cwd: 'static/assets/css/',
            src: 'styles.css',
            dest: 'static/assets/css/',
            expand: true
          }
        ]
      }
    },
    cssmin: {
      styles: {
        files: {
          'static/assets/css/styles.min.css': [
            'static/assets/libs/Effeckt.css/css/modules/page-transitions.css',
            'static/assets/libs/Effeckt.css/css/modules/tooltips.css',
            'static/assets/css/styles.css'
            //'static/assets/css/home.css'
          ]
        }
      },
      fold: {
        files: {
          'static/templates/_includes/foldCSS.hbs': [
            'static/assets/css/home.css'
          ]
        }
      }
    },
    uglify: {
      js: {
        files: {
          'static/assets/js/script.min.js': [
            'static/assets/libs/bootstrap/js/transition.js',
            'static/assets/libs/shine/dist/shine.min.js',
            'static/assets/libs/bootstrap/js/collapse.js',
            'static/assets/libs/bootstrap/js/modal.js',
            'static/assets/libs/Modernizr/modernizr.js',
            'static/assets/libs/Effeckt.css/js/Effeckt.js',
            'static/assets/libs/greensock-js/src/minified/TweenMax.min.js',
            'static/assets/libs/greensock-js/src/minified/jquery.gsap.min.js',
            'static/assets/js/poly-utils.js',
            'static/assets/js/preload.js',
            'static/assets/js/bootstrap-carousel.js',
            'static/assets/js/bootstrap-dynamic-carousel.js',
            'static/assets/js/autoScale.js',
            'static/assets/js/page-transitions.js',
            'static/assets/js/app.js',
            'static/assets/js/main.js'
          ]
        }
      }
    },
    copy: {
      toStatic: {
        files: [
          {
            expand: true,
            flatten: true,
            src: 'mockups/sprite/sprites.png',
            dest: 'static/assets/images/',
            filter: 'isFile'
          },
          {
            expand: true,
            flatten: true,
            src: 'mockups/ai/autovariables.scss',
            dest: 'static/assets/sass/',
            filter: 'isFile'
          },
          {
            expand: true,
            flatten: true,
            src: 'mockups/sprite/sprites.scss',
            dest: 'static/assets/sass/',
            filter: 'isFile'
          }
        ]},
      toDrupal: {
        files: [
          {
            expand: true,
            cwd: 'static/assets/images/',
            src: '**',
            dest: copyPathToDrupalTheme + 'images/'
          },
          {
            expand: true,
            flatten: true,
            src: 'static/assets/css/*',
            dest: copyPathToDrupalTheme + 'css/',
            filter: 'isFile'
          },
          {
            expand: true,
            flatten: true,
            src: 'static/assets/js/*',
            dest: copyPathToDrupalTheme + 'js/',
            filter: 'isFile'
          }
        ]}
    },
    uncss: {
      dist: {
        options: {
          ignoreSheets : [/fonts.googleapis/]
        },
        files: {
          'static/assets/css/home.css': ['static/fold.html']
        }
      }
    },
    assemble: {
      options: {
        production: production,
        assets: 'static/assets',
        helpers: ['static/templates/_helpers/*.js'],
        data: 'static/templates/_data/**/*.json',
        flatten: true,
        partials: 'static/templates/_includes/*.hbs',
        layoutdir: 'static/templates/_layouts',
        layout: 'default.hbs'
      },
      pagesEL: {
        options : {
          postprocess: function(src) {
            return require('frep').replaceStr(src, [
              {
                // Remove leading whitespace
                pattern: /^\s*/,
                replacement: ""
              },
              {
                pattern: /url\(\.\.\/images*/g,
                replacement: "url(assets/images"
              },
              {
                pattern: /url\(bootstrap*/g,
                replacement: "url(assets/css/bootstrap"
              }
            ]);
          }
        },
        src: ['./static/templates/_pages/index.hbs'],
        dest: './static/'
      },
      pagesEN: {
        options: {
          layout: 'defaultEN.hbs',
          postprocess: function(src) {
            return require('frep').replaceStr(src, [
              {
                // Remove leading whitespace
                pattern: /^\s*/,
                replacement: ""
              },
              {
                pattern: /url\(\.\.\/images*/g,
                replacement: "url(assets/images"
              },
              {
                pattern: /url\(bootstrap*/g,
                replacement: "url(assets/css/bootstrap"
              }
            ]);
          }
        },
        src: ['./static/templates/_pages/en.hbs'],
        dest: './static/'
      },
      pagesFold: {
        options: {
          production: false,
          layout: '',
          postprocess: function(src) {
            return require('frep').replaceStr(src, [
              {
                // Remove leading whitespace
                pattern: /^\s*/,
                replacement: ""
              },
              {
                pattern: /url\(\.\.\/images*/g,
                replacement: "url(assets/images"
              },
              {
                pattern: /url\(bootstrap*/g,
                replacement: "url(assets/libs/bootstrap/fonts"
              }
            ]);
          }
        },
        src: ['./static/templates/_pages/fold.hbs'],
        dest: './static/'
      }
    },
    htmlmin: {                                     // Task
      dist: {                                      // Target
        options: {                                 // Target options
          removeComments: true,
          collapseWhitespace: true
        },
        files: {                                   // Dictionary of files
          'static/index.html': 'static/index.html',     // 'destination': 'source'
          'static/en.html': 'static/en.html'
        }
      }
    },
    imagemin: {                          // Task
      dynamic: {                         // Another target
        files: [
          {
            expand: true,                  // Enable dynamic expansion
            cwd: 'mockups/imagesSrc/',                   // Src matches are relative to this path
            src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
            dest: 'static/assets/images/'                  // Destination path prefix
          }
        ]
      },
      sprite: {
        files: [
          {
            expand: true,                  // Enable dynamic expansion
            cwd: 'mockups/sprite/',                   // Src matches are relative to this path
            src: ['sprites.png'],   // Actual patterns to match
            dest: 'static/assets/images/'                  // Destination path prefix
          }
        ]
      }
    },
    watch: {
      sass: {
        files: [
          'static/assets/**/*.scss'
        ],
        tasks: ['sass'],
        options: {
          livereload: false,
          spawn: true
        }
      },
      autoprefixer: {
        files: [
          'static/assets/css/styles.css'
        ],
        tasks: ['newer:autoprefixer'],
        options: {
          livereload: true,
          spawn: true
        }
      },
      assemble: {
        files: ['static/templates/**/*.{hbs,js,json}'],
        tasks: ['newer:assemble'],
        options: {
          livereload: true,
          spawn: false
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-uncss');
  grunt.loadNpmTasks('grunt-newer');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.registerTask('default', ['sass', 'newer:autoprefixer', 'newer:assemble']);
  grunt.registerTask('drupal', ['copy:toDrupal']);
  grunt.registerTask('fold', ['uncss', 'cssmin:fold']);
  grunt.registerTask('production', ['uglify', 'sass', 'autoprefixer', 'cssmin:styles', 'assemble:pagesFold', 'uncss', 'cssmin:fold', 'assemble']);
};