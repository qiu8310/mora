'use strict';

angular.module('moraApp')
  .controller('HomeCtrl', function ($scope, Auth) {
    $scope.user = Auth.getLoginUser();



  });
