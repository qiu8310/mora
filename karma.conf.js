// Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

/*
 karma-chrome-launcher                0.1.5        0.1.7    0.1.7  karma-chrome-launcher
 karma-ng-html2js-preprocessor        0.1.0        0.1.2    0.1.2  karma-ng-html2js-preprocessor
 karma-jasmine                        0.2.2        0.2.3    0.3.2  karma-jasmine
 karma-coverage                       0.2.6        0.2.7    0.2.7  karma-coverage
 grunt-karma-coveralls                2.5.2        2.5.3    2.5.3  grunt-karma-coveralls
 karma                                0.12.24      0.12.28  0.12.28  karma
 */

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],

    // 会默认加载所有 karma 开头的插件，不用指定
    //plugins: [
    //  'karma-coverage'
    //],

    // list of files / patterns to load in the browser
    files: [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/angular-resource/angular-resource.js',
      'app/bower_components/angular-cookies/angular-cookies.js',
      'app/bower_components/angular-sanitize/angular-sanitize.js',
      'app/bower_components/ui-router/release/angular-ui-router.js',
      'app/bower_components/angular-md5/angular-md5.js',
      'app/scripts/app.js',
      'app/scripts/*/**/*.js',
      //'test/mock/**/*.js',
      'test/spec/**/*.js'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8080,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_DEBUG,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    reporters: ['coverage'],
    preprocessors: {
      "app/scripts/**/*.js": "coverage"
    },
    coverageReporter: {
      type: "lcov",
      dir: "test/coverage/"
    },



    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: false
  });
};
