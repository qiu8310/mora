angular.module('moraApp')
  .directive('extendAttrs', function ($parse, _) {

    return {
      restrict: 'A',

      link: function(scope, element, attrs) {
        var data = scope.$parent.$eval(attrs.extendAttrs);
        _.each(data, function(val, key) {
          element.attr(_.lineCase(key), val);
        });

      }
    };
  });