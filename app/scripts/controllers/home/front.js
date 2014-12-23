

angular.module('moraApp')

  .controller('FrontBannerCtrl', function($scope, C){
    $scope.TYPE = C.constants.BANNER_TYPE;

    $scope.createBanner = function(type) {
      $scope.$parent.createBanner(type).then(function(data) {
        console.log(data);
      });
    };

  })



  .controller('FrontStreamCtrl', function($scope){

  });