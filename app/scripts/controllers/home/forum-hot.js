angular.module('moraApp')
  .controller('ForumHotCtrl', function($scope, $http, C) {


    $http.get('api/forum/hot/').success(function(data) {
      $scope.list = _.map(data, function(thread) {
        thread.isHot = true;
        if (thread.audioUrl) {
          thread.audioUrl += C.res.audioPrefix;
        }
        return thread;
      });
    });



  });