'use strict';

angular
  .module('moraApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute',
    'angular-md5'
  ])
  .config(function ($routeProvider, $locationProvider, $httpProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    $httpProvider.interceptors.push('HttpInterceptor');

    /*
     TOKEN 认证
     带 WWW 开头的一般表示 Response Header，不带表示 Request Header

     http://tools.ietf.org/html/draft-ietf-httpbis-p7-auth-19#section-4.4
     Authenticate: Newauth realm="apps", type=1, title="Login to \"apps\"", Basic realm="simple"

     https://developers.google.com/youtube/2.0/developers_guide_protocol_clientlogin

     http://www.ietf.org/rfc/rfc2617.txt
    */


    // 为了支持 POST，默认 angular POST 的 Content-Type: application/json
    // 也可以不在前端实现，而在后端去实现，如 PHP: json_decode(file_get_contents('php://input'), true)
    //
    // 扩充：form 上加 enctype="multipart/form-data" 会将 Content-Type 设为了 multipart/form-data
    /*
    $httpProvider.defaults.transformRequest = function(obj) {
      if (typeof obj === 'string') {
        return obj;
      }
      var params = [];
      angular.forEach(obj, function(val, key) {
        params.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
      });
      return params.join('&');
    };

    angular.extend($httpProvider.defaults.headers.post, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    */



    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/home', {
        redirectTo: '/'
      })


      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })

      .when('/algorithm/city', {
        templateUrl: 'views/algorithm/city.html',
        controller: 'AlgorithmCityCtrl'
      })
      .otherwise({
        redirectTo: function() {
          window.location.href = '/404.html';
        }
      });
  });
