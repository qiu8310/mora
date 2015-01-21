angular.module('moraApp')
  .directive('cityGroup', function() {
    return {
      replace: true,
      templateUrl: 'views/tpl/city-group.html',
      scope: {
        group: '=',
        chose: '='
      }
    };
  });
