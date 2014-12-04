/**
 *
 * @example
 *
 *  <input type="password" ng-model="user.password" name="password" />
 *  <input type="password" ng-model="user.password_check" equal-validate="password" name="password_check" />
 *
 */
angular.module('moraApp')
  .directive('equalValidate', function () {
    return {
      require: ['?ngModel', '^form'],
      restrict: 'A',
      link: function postLink(scope, element, attrs, models) {
        var model = models[0],
          form = models[1];

        var target = form[attrs.equalValidate];

        scope.$watch(function() {
          return target.$modelValue + '|' + model.$modelValue;
        }, function() {

          if (model.$isEmpty(target.$modelValue) ||  model.$isEmpty(model.$modelValue)) {
            model.$setValidity('equal', null);
            return ;
          }

          var valid = target.$modelValue === model.$modelValue;
          model.$setValidity('equal', valid);

        });

      }
    };
  });
