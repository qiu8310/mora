// Generated on 2014-10-02 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
var LIVERELOAD_PORT = 35999;
var mountFolder = function(connect, dir) {
  return connect.static(require('path').resolve(dir));
};
var modRewrite = require('connect-modrewrite');

module.exports = function (grunt) {

  function getMiddleware(dirs) {

    if (!Array.isArray(dirs)) { dirs = [dirs]; }

    return function(connect) {

      var result = [

        // text-free
        require('./plugins/node/server')(grunt, dirs),


        // rewrite
        modRewrite(['!\\.\\w+$ /index.html [L]'])

      ];

      dirs.forEach(function(dir) { result.push(mountFolder(connect, dir)); });


      return result;
    };
  }




  grunt.loadTasks( 'plugins/grunt/tasks' );

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var yeomanConfig = {
    app : require('./bower.json').appPath || 'app',
    dist: 'sinaapp/mora/1/frontend'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: yeomanConfig,

    // My custom cmd
    shell: {
      hello: {
        cmd: 'echo "\nHello, you are on: " && pwd'
      },
      publish: {
        cmd: 'sh sinaapp/mora/publish.sh'
      },
      git: {
        options: {
          stdout: false,
          callback: function(stdout, done){
            console.log(stdout);
            done();
          }
        },
        cmd: 'git st'
      }
    },

    // 自动注入需要的 class 到 main.css 中
    classImport: {
      options: {
        classFiles: '<%= yeoman.app %>/styles/auto-inject/{,*/}*.css'
      },
      dev: {
        src: [
          '<%= yeoman.app %>/*.html',
          '<%= yeoman.app %>/{views,demo}/{,**/}*.html',
          '.tmp/{,**/}*.html'],
        dest: '.tmp/styles/main.css'
      }
    },

    textFree: {
      options: {
        injectScript: 'http://localhost:9999/scripts/text-free.js',
        postUrl: '/textfree/update',
        commentStart: 'tfStart',
        commentEnd: 'tfEnd',
        injectClassPrefix: '__tf-', // 当用 connect 插件时，会 inject 一些 CSS 样式，让 CSS 样式以此开头
        editableFileExt: ['html', 'htm'],
        noComment: false,  // 如果为 true，则不会在 html 文件中注入 comment，在部署的时候可以配置为 true TODO 去掉这个 ？
        jsonFile: '<%= yeoman.app %>/tf/data.json',
        jsonFileCycleMinutes: 60, // 60分钟之后就重新写一个新的 jsonFile 文件，只有设置成0才会覆盖最开始的那个文件
        tplStartTag: '{%',
        tplEndTag: '%}',
        filters: [ // TODO 不用写 filters，自动根据 target 获取所有的 文件
          '<%= yeoman.app %>/demo/tpl.html'
        ]
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          src: 'demo/*.html',
          dest: '.tmp'
        }]
      }
    },


    // coverage
    /* jshint ignore:start */
    coveralls: {
      options: {
        debug: true,
        coverage_dir: 'test/coverage',
        dryRun: false,
        force: true,
        recursive: true
      }
    },
    /* jshint ignore:end */


    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall']
      },
      js: {
        files: '<%= jshint.all %>',
        //files: ['<%= yeoman.app %>/scripts/{,**/}*.js', 'plugins/grunt/tasks/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: true
        }
      },
      classImport: {
        //files: ['<%= classImport.options.classFiles %>', '<%= classImport.dev.src %>'],
        files: ['<%= classImport.options.classFiles %>'],
        tasks: 'classImport'
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'classImport', 'autoprefixer']
      },
      jade: {
        files: ['<%= yeoman.app %>/{,**/}*.jade', '../jade/{,**/}*.jade'],
        tasks: ['jade']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= yeoman.app %>/{,**/}*.html',
          '.tmp/{,**/}*.html',
          '.tmp/styles/{,*/}*.css',
          '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9999,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0',
        livereload: LIVERELOAD_PORT
      },
      livereload: {
        options: {
          //open: 'http://localhost:9999/demo/tpl.html', // 这里如果设置成 true，默认打开 http://[hostname][:port]/
          open: false,
          middleware: getMiddleware(['.tmp', yeomanConfig.app])
          /*
          base: [
            '.tmp',
            '<%= yeoman.app %>'
          ]
          */
        }
      },
      test: {
        options: {
          port: 9998,
          middleware: getMiddleware(['.tmp', 'test', yeomanConfig.app])
          /*base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]*/
        }
      },
      dist: {
        options: {
          middleware: getMiddleware(['.tmp', yeomanConfig.dist])
          //base: '<%= yeoman.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= yeoman.app %>/scripts/{,**/}*.js',
        '!<%= yeoman.app %>/scripts/vendors/{,*/}*.js',
        'plugins/grunt/tasks/{,*/}*.js',
        'plugins/node/*.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/*',
            '!<%= yeoman.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/styles/',
          src: '{,*/}*.css',
          dest: '.tmp/styles/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ['<%= yeoman.app %>/index.html'],
        ignorePath: '<%= yeoman.app %>/'
      },
      sass: {
        src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: '<%= yeoman.app %>/bower_components/'
      }
    },

    // Compiles Sass to CSS and generates necessary files if requested
    compass: {
      options: {
        sassDir: '<%= yeoman.app %>/styles',
        require: [
          './plugins/sass/functions.rb',
          'ceaser-easing' // http://easings.net/zh-cn 缓动库
        ],
        cssDir: '.tmp/styles',
        generatedImagesDir: '.tmp/images',
        imagesDir: '<%= yeoman.app %>/images',
        javascriptsDir: '<%= yeoman.app %>/scripts',
        fontsDir: '<%= yeoman.app %>/styles/fonts',
        importPath: '<%= yeoman.app %>/bower_components',
        httpImagesPath: '../images',
        httpGeneratedImagesPath: '../images',
        httpFontsPath: '/styles/fonts',
        relativeAssets: false,
        assetCacheBuster: false,
        raw: 'Sass::Script::Number.precision = 10\n'
      },
      dist: {
        options: {
          generatedImagesDir: '<%= yeoman.dist %>/images'
        }
      },
      server: {
        options: {
          debugInfo: true
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/styles/{,*/}*.css',
            '<%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: [
        '{<%= yeoman.app %>,.tmp}/*.html',
        '<%= yeoman.app %>/demo/{,**/}*.jade',
        '<%= yeoman.app %>/learn/{,**/}*.jade'
      ],
      options: {
        dest: '<%= yeoman.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/{,**/}*.html'],
      css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%= yeoman.dist %>']
      }
    },

    // HTML 预处理
    jade: {
      options: {
        pretty: true
      },
      dist   : {
        files: [
          {
            expand: true,
            src   : ['{,**/}*.jade'],
            cwd   : '<%= yeoman.app %>',
            dest  : '.tmp',
            ext   : '.html'
          }
        ]
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        root: '<%= yeoman.app %>',
        noRebase: true
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= yeoman.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          src: ['*.html', 'views/{,**/}*.html'],
          dest: '<%= yeoman.dist %>'
        }]
      }
    },

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.app %>',
          dest: '<%= yeoman.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,**/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/*',
            'learn/**',
            '!learn/{,**/}*.jade'
          ]
        }, {
          expand: true,
          dot: true,
          cwd: '.tmp',
          dest: '<%= yeoman.dist %>',
          src: [
            'images/generated/*',
            '*.html',
            'views/{,**/}*.html',
            'demo/{,**/}*.html',
            'learn/{,**/}*.html'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.app %>/styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'jade',
        'compass:server'
      ],
      test: [
        'compass'
      ],
      dist: [
        'jade',
        'compass:dist',
        'imagemin',
        'svgmin'
      ]
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= yeoman.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= yeoman.dist %>/scripts/scripts.js': [
    //         '<%= yeoman.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'bowerInstall',
      'concurrent:server',
      'classImport',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('server', function (target) {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve:' + target]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'classImport',
    'autoprefixer',
    'connect:test',
    'karma',
    'coveralls'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'bowerInstall',
    'useminPrepare',
    'concurrent:dist',
    'classImport',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('publish', function(comment) {
    var cmd = 'shell:publish' + (comment ? ':' + comment : '');
    grunt.task.run(cmd);
  });
};
