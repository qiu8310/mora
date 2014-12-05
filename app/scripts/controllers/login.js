'use strict';

angular.module('moraApp')
  .controller('LoginCtrl', function ($scope, _, $http, $rootScope, Storage) {

    $scope.user = Storage.get('loginUser', {});

    $scope.submit = function(e) {
      var user = $scope.user;
      Storage.set('loginUser', user.rememberMe ? user : {});

      _.asyncClickOn(e.target.submitBtn, function() {
        return $http
          .post('api/login', user)
          .success(function() {
            $rootScope.$broadcast('login:success');
          });
      });
    };
  });
