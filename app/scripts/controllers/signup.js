'use strict';

angular.module('moraApp')
  .controller('SignupCtrl', function ($scope) {
    $scope.user = {};

    $scope.showFeedback = function(ctrl) {
      if (ctrl && ctrl.$valid && ctrl.$dirty) {
        return true;
      }
      return false;
    };

    $scope.getCssClasses = function(ctrl) {
      if (!ctrl) {
        return false;
      }
      return {
        'has-error': ctrl.$invalid && ctrl.$dirty,
        'has-success': ctrl.$valid && ctrl.$dirty
      };
    };

    $scope.showError = function(ctrl, error) {
      if (!ctrl) {
        return false;
      }
      return ctrl.$error[error];
    };

    $scope.submit = function() {
      console.log($scope.signup);
    };
  });
