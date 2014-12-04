'use strict';

angular.module('moraApp')
  .controller('LoginCtrl', function ($scope, _, $http, $rootScope, Env) {

    if (Env.isTest) {
      $scope.user = {
        email: 'mora@liulishuo.com',
        password: '123qweasd'
      };
    }



    $scope.submit = function(e) {
      _.asyncClickOn(e.target.submitBtn, function() {
        return $http
          .post('api/login', $scope.user)
          .success(function() {
            $rootScope.$broadcast('login:success');
          });
      });
    };
  });
