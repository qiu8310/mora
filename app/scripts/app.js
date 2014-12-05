'use strict';

angular
  .module('moraApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'angular-md5'
  ])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('HttpInterceptor');

    // 加上一个默认的头部信息
    angular.extend($httpProvider.defaults.headers.common, {
      'Powered-By': 'Angular-Mora',
      'Mora-Version': 'v1'
    });



    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })

      .state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })

      .state('demo/wechat', {
        url: '/demo/wechat',
        templateUrl: 'views/demo/wechat.html',
        controller: 'DemoWechatCtrl'
      })

      .state('algorithm/city', {
        url: '/algorithm/city',
        templateUrl: 'views/algorithm/city.html',
        controller: 'AlgorithmCityCtrl'
      });




    // 处理重定向
    $urlRouterProvider
      .when('/home', '/')
      .when('/index', '/')
      .when('/main', '/')
      .otherwise(function() {
        window.location.href = '/404.html';
      });
  });
