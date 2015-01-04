'use strict';

angular.module('moraApp')
  .filter('countDown', function() {
    return function (input) {
      var time = parseInt(input, 10);
      if (time >= 86400) {
        return Math.floor(time / 86400) + ' 天';
      } else {
        var h = Math.floor(time / 3600),
          rest = time % 3600,
          m = Math.ceil(rest / 60);
        return (h > 0 ? (h + '时') : '') + m + '分';
      }
    };
  })
  .filter('time', function ($filter) {
    return function (input) {
      return $filter('date')(input * 1000, 'yyyy-MM-dd HH:mm:ss');
    };
  });
