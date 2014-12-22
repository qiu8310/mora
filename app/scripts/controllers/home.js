'use strict';

angular.module('moraApp')
  .controller('HomeCtrl', function ($scope, Auth, $modal, $http) {
    $scope.user = Auth.getLoginUser();


    $scope.editThread = function(thread) {
      $modal.open({
        templateUrl: 'views/incs/modal-thread-editor.html',
        controller: 'ThreadEditorCtrl',
        backdrop: 'static',
        windowClass: 'thread-editor-modal',
        resolve: {
          ThreadData: function() { return thread; }
        }
      }).result.then(function() {

        });
    };


    $scope.hotThread = function(thread) {
      var api = thread.isHot ? 'calm_down' : 'make_hot';
      return $http.put('api/forum/' + thread.id + '/' + api).success(function() {
        thread.isHot = !thread.isHot;
      });
    };

    $scope.deleteThread = function(thread) {
      var cb = function() { thread.isDeleted = !thread.isDeleted; };
      if (thread.isDeleted) {
        return $http.put('api/forum/' + thread.id + '/restore').success(cb);
      } else {
        return $http.delete('api/forum/' + thread.id).success(cb);
      }
    };

    $scope.recommendThread = function(thread) {
      var op = thread.isRecommended ? 'delete' : 'post';
      return $http[op]('api/forum/' + thread.id + '/recommend').success(function() {
        thread.isRecommended = !thread.isRecommended;
      });
    };

    $scope.essenceThread = function(thread) {
      var op = thread.isEssential ? 'delete' : 'post';
      return $http[op]('api/forum/' + thread.id + '/essence').success(function() {
        thread.isEssential = !thread.isEssential;
      });
    };


  });
