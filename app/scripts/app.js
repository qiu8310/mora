'use strict';

angular
  .module('moraApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ngRoute'
  ])
  .config(function ($routeProvider, $locationProvider) {

    $locationProvider.html5Mode(true).hashPrefix('!');

    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .when('/home', {
        redirectTo: '/'
      })


      .otherwise({
        redirectTo: function() {
          window.location.href = '/404.html';
        }
      });
  });
