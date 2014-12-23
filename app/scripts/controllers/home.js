'use strict';

angular.module('moraApp')
  .controller('HomeCtrl', function ($scope, $rootScope, Auth, $modal, $http) {
    $scope.user = Auth.getLoginUser();


    $rootScope.findThread = function() {
      return $modal.open({
        templateUrl: 'views/incs/modal-thread-finder.html',
        controller: 'ThreadFinderCtrl',
        backdrop: 'static',
        size: 'lg',
        windowClass: 'thread-finder-modal'
      }).result;
    };

    $rootScope.findTeam = function() {
      return $modal.open({
        templateUrl: 'views/incs/modal-team-finder.html',
        controller: 'TeamFinderCtrl',
        backdrop: 'static',
        size: 'lg',
        windowClass: 'team-finder-modal'
      }).result;
    };

    $rootScope.findCourse = function() {
      return $modal.open({
        templateUrl: 'views/incs/modal-course-finder.html',
        controller: 'CourseFinderCtrl',
        backdrop: 'static',
        size: 'lg',
        windowClass: 'course-finder-modal'
      }).result;
    };


    $scope.editThread = function(thread) {
      return $modal.open({
        templateUrl: 'views/incs/modal-thread-editor.html',
        controller: 'ThreadEditorCtrl',
        backdrop: 'static',
        windowClass: 'thread-editor-modal',
        resolve: {
          ThreadData: function() { return thread; }
        }
      }).result;
    };

    $scope.createBanner = function(type) {
      return $scope.editBanner(type, null);
    };

    $scope.editBanner = function(type, banner) {
      return $modal.open({
        templateUrl: 'views/incs/modal-banner-editor.html',
        controller: 'BannerEditorCtrl',
        backdrop: 'static',
        windowClass: 'banner-editor-modal',
        resolve: {
          BannerType: function() { return type; },
          BannerData: function() { return banner; }
        }
      }).result;
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
