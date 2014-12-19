angular.module('moraApp')
  .controller('ThreadEditorCtrl', function($scope, $modalInstance, ThreadData, $http, _) {
    $scope.thread = {};

    var fields = ['title', 'body'];
    _.each(fields, function(key) {
      $scope.thread[key] = ThreadData[key];
    });

    $scope.save = function() {
      if (_.any(fields, function(key) { return $scope.thread[key] !== ThreadData[key]; })) {

        return $http.put('api/forum/' + ThreadData.id + '/', $scope.thread).then(function() {
          _.each($scope.thread, function(val, key) {
            ThreadData[key] = val;
          });
          $modalInstance.close($scope.thread);
        });
      } else {
        $modalInstance.dismiss('nothing_change');
      }

    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });