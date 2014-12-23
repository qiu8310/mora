angular.module('moraApp')
  .controller('UserDetailCtrl', function($scope, UserSer, UserData) {


    $scope.user = UserData;


    $scope.forbid = function(user) {
      return UserSer.forbid(user.id).then(function() {
        user.isBlocked = true;
      });
    };



  });