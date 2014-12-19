'use strict';

angular.module('moraApp')
  .filter('time', function ($filter) {
    return function (input) {
      return $filter('date')(input * 1000, 'yyyy-MM-dd HH:mm:ss');
    };
  });
