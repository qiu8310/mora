angular.module('moraApp')
  .controller('TeamDetailCtrl', function($scope, $http, $stateParams, C) {


    $scope.categories = C.team.categories;
    $http.get('api/' + $stateParams.id).success(function(data) {
      $scope.detail = data;
    });

  });