angular.module('moraApp')
  .controller('TeamDetailCtrl', function($scope, $http, $stateParams, C) {


    $scope.categories = C.team.categories;
    $http.get('api/' + $stateParams.id).success(function(data) {
      $scope.detail = data;
    });


    $scope.kickMember = function(member, index) {
      return $http.delete('api/' + $scope.detail.resourceId + '/members?userId=' + member.resourceId)
        .success(function() {
          $scope.detail.members.splice(index, 1);
        });
    };

  });