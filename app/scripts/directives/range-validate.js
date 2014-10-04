/**
 *
 * @example
 *
 * <input type="text" range-validate="4-10|filter" />
 *
 * filter 只会把 modelValue filter 成指定的值，不会改变 viewValue
 *
 */
angular.module('moraApp')
  .directive('rangeValidate', function () {
    return {
      require: '?ngModel',
      restrict: 'A',
      link: function postLink(scope, element, attrs, model) {
        if (!model) {
          return ;
        }

        var ranges = attrs.rangeValidate.match(/(\d+)\-(\d+)\|?(\w+)?/),
          start, end, op;
        if (!ranges) {
          throw new Error('rangeValidate should be set to something like this: range-validate="4-10|filter"');
        }

        start = parseInt(ranges[1]);
        end = parseInt(ranges[2]);
        op = ranges[3] || false;

        model.$parsers.unshift(function(modelValue) {
          if (modelValue === undefined) {
            return ;
          }

          var size = modelValue.length,
            valid = start <= size && size <= end;

          model.$setValidity('range', valid);

          if (op === 'filter' && size > end) {
            modelValue = modelValue.substr(0, end);
          }

          return modelValue;
        });


      }
    };
  });
