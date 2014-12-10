'use strict';

angular.module('moraApp')
  .controller('LoginCtrl', function ($scope, _, $http, $rootScope, Auth) {

    $scope.user = Auth.getLoginUser(true);

    $scope.submit = function(e) {
      Auth.setLoginUser($scope.user);

      _.asyncClickOn(e.target.submitBtn, function() {
        return $http
          .post('api/login', $scope.user)
          .success(function() {
            $rootScope.$broadcast('login:success');
          });
      });
    };
  });
