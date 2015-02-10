// Generated on 2014-10-02 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'
var LIVERELOAD_PORT = 35999;
var TF = require('text-free');
var path = require('path');
var modRewrite = require('connect-modrewrite');

var APPS = ['spring', 'course', 'lover'];


module.exports = function (grunt) {

  var APPS_PATH_STRING = APPS.length === 1 ? APPS[0] : '{' + APPS.join(',') + '}';

  grunt.loadTasks('plugins/grunt/tasks');

  //grunt.loadNpmTasks('text-free');
  //function getConnectMiddleWares(webRootDirs) {
  //  return TF.connectHelper(grunt, webRootDirs, function() {
  //    this.push(modRewrite(['!\\.\\w+([#\\?].*)?$ /index.html [L]']));
  //  });
  //}

  // Disable text-free
  function getConnectMiddleWares(webRootDirs) {
    if (!Array.isArray(webRootDirs)) { webRootDirs = [webRootDirs]; }
    return function(connect) {
      var result = [];

      //result.push(modRewrite(['!\\.\\w+([#\\?].*)?$ /index.html [L]']));
      result.push(modRewrite([

        // http://x.com/a/b/c/styles/spring => http://x.com/spring.html
        '^/(?:[\\w\\/]+\\/)?(' + APPS.join('|') + ')([^\\.]*)$ /$1.html [L]',

        // http://x.com/a/b/c/styles/spring.css => http://x.com/styles/spring.css
        '^.*?(styles|images|scripts|views)(\\/.*)$ /$1$2 [L]'

      ]));

      webRootDirs.forEach(function(dir) {
        result.push(connect.static(path.resolve(dir)));
      });

      return result;
    };
  }


  function getSafeJsonFromFile(file) {
    var result;
    try {result = require(path.resolve(file));} catch (e) {result = {};}
    return result;
  }

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  var yeomanConfig = {
    app : getSafeJsonFromFile('./bower.json').appPath || 'app',
    dist: 'dist',
    deploy: '/Users/mora/Workspace/angular/neo_huodong/app/views/neo_huodong/api/huodongs'
  };

  // http://mora.sinaapp.com/spa-bootstrap-manager.php?token=d7P843348fa7ea4LedDae155380aKdDfdO4dKQ10
  var qiniuConfig = getSafeJsonFromFile(process.env.HOME + '/qiniu.json'),
    secretConfig = getSafeJsonFromFile(process.env.HOME + '/.secret.json');


  var appCache = getSafeJsonFromFile('./.app-cache.json'),
    saveAppCache = function(){ grunt.file.write('./.app-cache.json', JSON.stringify(appCache, null, 4)); };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    yeoman: yeomanConfig,

    deployAsset: {
      options: {
        dry: false,
        deleteUploaded: false,

        // tpls/incs 文件夹里的模板使用 ngtemplates 压缩，所以可以忽略它们
        ignoreUploadAssets: ['<%= yeoman.dist %>/views/{tpls,incs}/*.html'],
        assetMapJsonFile: '<%= yeoman.dist %>/asset-map.json',
        uploader: 'qiniu',
        qiniu: {
          accessKey: qiniuConfig.accessKey,
          secretKey: qiniuConfig.secretKey,
          bucket: 'liulishuo',
          prefix: 'ac-'
        },

        angularTplTransform: function(tplPath, tplCalledBy) {
          tplPath = tplPath.replace('scripts/', '');
          //if (!require('fs').existsSync(tplPath)) {
          //  var parts = tplPath.split('/');
          //  parts.splice(-1, 0, 'views/partials'); // 给模板加上前缀
          //  tplPath = parts.join('/');
          //}

          //if (tplPath.indexOf('/tpls/') >= 0) {
          ////if (/\/(?:tpls|incs)\//.test(tplPath)) {
          //  return false;
          //}

          return tplPath;
        }
      },
      dist: [
        '<%= yeoman.dist %>/' + APPS_PATH_STRING + '.html',
        '<%= yeoman.dist %>/views/' + APPS_PATH_STRING + '/**/*.html',
        '<%= yeoman.dist %>/styles/*' + APPS_PATH_STRING + '*.css',
        '<%= yeoman.dist %>/scripts/*' + APPS_PATH_STRING + '*.js',
        '!<%= yeoman.dist %>/scripts/*vendor.js'
      ],

      replace: {
        options: {
          assetMapJsonFile: null
        },
        src: ['<%= yeoman.dist %>/replace/*.html']
      }
    },

    spaBootstrap: {
      options: {
        api: function(m) {
          return 'http://mora.sinaapp.com/spa-bootstrap.php?m=' + m;
          //return 'http://mora.com/spa-bootstrap.php?m=' + m;
        },
        token: secretConfig.spaBootstrapCrmToken
      },
      spring: {
        options: {
          index: '<%= yeoman.dist %>/spring.html',
          app: 'activity',
          secureCode: secretConfig.spaBootstrapActivitySecure,
          bootstrap: '<%= yeoman.dist %>/bootstrap.html'
        }
      }
    },

    // 自动注入需要的 class 到 main.css 中
    classImport: {
      options: {
        classFiles: '<%= yeoman.app %>/styles/auto-inject/{,*/}*.css'
      },
      dist: {
        files: (function() {
          var obj = {};
          APPS.forEach(function(app) {
            obj['.tmp/styles/' + app + '.css'] = [
              '<%= yeoman.app %>/' + app + '.html',
              '<%= yeoman.app %>/views/' + app + '/**/*.html',
              '.tmp/**/*.html'
            ];
          });
          return obj;
        })()
      }
    },

    ngtemplates: {
      options: {
        module: 'moraApp',
        htmlmin: '<%= htmlmin.dist.options %>',
        usemin: '/scripts/scripts.js'
      },
      dist: {
        cwd: '<%= yeoman.app %>',
        src: ['views/*.html', 'views/tpl/*.html'], // 其它模板传到七牛上去
        dest: '.tmp/scripts/ngtemplates.js'
      }
    },

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

    replace: {
      dist: {
        options: {
          patterns: [
            {
              match:  /\/\/@REMOVE\s+.*?$/mg,
              replacement: ''
            },
            {
              match: /\/\/@REMOVE_START([\s\S]*?)\/\/@REMOVE_END/g,
              replacement: ''
            },
            {
              match: /\/\/@INJECT\s+/g,
              replacement: ''
            },
            {
              match: /\/\*@INJECT_START([\s\S]*?)@INJECT_END\*\//g,
              replacement: '$1'
            },
            {
              match: /@@([A-Z_]+)@@/g,
              replacement: function(match, key) {
                // 版本号每次都递增，方便跟踪最新的版本是否部署上去了; 另外加上当前时间在 VERSION 后面
                if (key.indexOf('VERSION') >= 0) {
                  appCache[key] = appCache[key] ? appCache[key] + 1 : 1;
                  saveAppCache();
                  return 'Version: ' + appCache[key] + ', publish at ' + (new Date());
                }
                return (key in appCache) ? appCache[key] : match;
              }
            },
            {
              match: /__UPLOADED(?:__(IMAGES|VIEWS|INDEX|ALL))?__ASSETS__/,
              replacement: function(match, need, offset, string, source, target) {
                need = (need || 'ALL').toLocaleLowerCase();

                var allAssets = getSafeJsonFromFile(grunt.config.get('deployAsset.options.assetMapJsonFile'));
                var key = path.basename(source).split('.').shift();
                var dir = path.dirname(path.resolve(source)) + path.sep;


                var result = {images: {}, views: {}, index: false};
                var assetKeys = Object.keys(result);

                Object.keys(allAssets).forEach(function(local) {
                  if (local.indexOf(dir) === 0) {
                    var parts, remote, type, cate, localKey;
                    remote = allAssets[local];
                    local = local.substr(dir.length);
                    parts = local.split(path.sep);
                    type = parts.shift();
                    cate = parts.shift();

                    localKey = parts.join('/');
                    if (local === key + '.html') {
                      result.index = remote;
                    } else if (cate === key) {
                      if (type === 'images') { result.images[localKey] = remote; }
                      else if (type === 'views') { result.views[localKey] = remote; }
                    }
                  }
                });

                //console.log(result);
                //return match;

                result = (need in result) ? result[need] : result;
                return JSON.stringify(result);
              }
            }
          ]
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.dist %>',
          dest: '<%= yeoman.dist %>/replace',
          src: ['{' + APPS.join(',') + '}.html', '!404.html']
        }]
      }

    },

    textFree: {
      options: {
        commentStart: 'tfStart',
        commentEnd: 'tfEnd',
        injectClassPrefix: '__tf-', // 当用 connect 插件时，会 inject 一些 CSS 样式，让 CSS 样式以此开头
        htmlFileExts: ['html', 'htm'],
        noComment: false,  // 如果为 true，则不会在 html 文件中注入 comment，在部署的时候可以配置为 true TODO 去掉这个 ？
        jsonFile: '<%= yeoman.app %>/tf/data.json',
        jsonFileCycleMinutes: 600, // 600分钟之后就重新写一个新的 jsonFile 文件，只有设置成0才会覆盖最开始的那个文件
        tplStartTag: '{%',
        tplEndTag: '%}'
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.app %>',
          //src: ['views/*.html', 'index.html'],
          src: ['404.html'],
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
      //bower: {
      //  files: ['bower.json'],
      //  tasks: ['bowerInstall']
      //},
      js: {
        files: '<%= jshint.all %>',
        //files: ['<%= yeoman.app %>/scripts/{,**/}*.js', 'plugins/grunt/tasks/{,*/}*.js'],
        tasks: ['newer:jshint:all'],
      },
      classImport: {
        files: [
          '<%= classImport.options.classFiles %>',
          '<%= yeoman.app %>/**/*.html',
          '.tmp/**/*.html'
        ],
        //files: ['<%= classImport.options.classFiles %>'],
        tasks: 'classImport',
        options: { livereload: '<%= connect.options.livereload %>' }
      },
      jsTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['newer:jshint:test', 'karma']
      },
      compass: {
        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass:server', 'classImport', 'autoprefixer'],
        options: { livereload: '<%= connect.options.livereload %>'}
      },
      jade: {
        files: ['<%= yeoman.app %>/{,**/}*.jade', '../jade/{,**/}*.jade'],
        tasks: ['jade']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: { livereload: '<%= connect.options.livereload %>'},
        files: [
          //'<%= yeoman.app %>/{,**/}*.html',
          //'.tmp/{,**/}*.html',
          //'.tmp/styles/{,*/}*.css',
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
          //open: 'http://localhost:9999#!/',
          open: false,
          middleware: getConnectMiddleWares(['.tmp', yeomanConfig.app])
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
          middleware: getConnectMiddleWares(['.tmp', 'test', yeomanConfig.app])
          /*base: [
            '.tmp',
            'test',
            '<%= yeoman.app %>'
          ]*/
        }
      },
      dist: {
        options: {
          middleware: getConnectMiddleWares(['.tmp', yeomanConfig.dist])
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
        //browsers: ['last 5 version']
        browsers: ['last 40 Chrome versions']
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
        src: ['<%= yeoman.app %>/*.html'],
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
      // https://github.com/jakubpawlowicz/clean-css#how-to-use-clean-css-programmatically
      options: {
        //advanced: false,
        //aggressiveMerging: false,
        shorthandCompacting: false,
        root: '<%= yeoman.app %>',
        rebase: false
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
          removeComments: true,
          removeScriptTypeAttributes:     true,
          removeStyleLinkTypeAttributes:  true,

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


    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: ['*.js', '!vendor.js', '!templates.js'],
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
      deploy: {
        files: {
          '<%= yeoman.deploy %>/_valentine_day.erb': '<%= yeoman.dist %>/replace/lover.html',
          '<%= yeoman.deploy %>/_spring_festival.erb': '<%= yeoman.dist %>/replace/spring.html',
          '<%= yeoman.deploy %>/_laishixiong.erb': '<%= yeoman.dist %>/replace/course.html'
        }
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
      //'bowerInstall',
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
    //'bowerInstall',
    'useminPrepare',
    'concurrent:dist',
    'classImport',
    'autoprefixer',
    //'ngtemplates',
    'concat',
    'ngAnnotate',
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

  grunt.registerTask('deploy', ['build', 'deployAsset:dist', 'replace', /*'deployAsset:replace'*/ 'copy:deploy']);

  //grunt.registerTask('publish', ['build', 'deployAsset:dist', 'spaBootstrap:spring']);


  //grunt.registerTask('publish', function(comment) {
  //  var cmd = 'shell:publish' + (comment ? ':' + comment : '');
  //  grunt.task.run(cmd);
  //});
};
