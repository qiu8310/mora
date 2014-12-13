'use strict';

angular.module('moraApp')
  .controller('HomeCtrl', function ($scope) {
    $scope.share = function(url) {
      location.href = url;
    };
  });
