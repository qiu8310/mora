/**
 *
 * @example
 *  <input type="email" ng-model="email" unique-field="[table].[field]" />
 *
 */
angular.module('moraApp')
  .directive('uniqueValidate', function ($http) {
    return {
      require: '?ngModel',
      restrict: 'A',
      link: function postLink(scope, element, attrs, model) {

        var tableField = attrs.uniqueValidate.replace(/\s+/, '').split('.');

        if (tableField.length !== 2) {
          throw new Error('uniqueValidate directive should set to: unique-field="[table].[field]"');
        }


        scope.$watch(attrs.ngModel, function(modelValue) {

          if (model.$isEmpty(modelValue)) {
            return false;
          }

          var path = 'api/' + tableField.join('/') + '/' + modelValue;

          model.$setValidity('unique', null);
          $http
            .get(path)
            .success(function(data) {
              model.$setValidity('unique', data.data.exist === false);
            });
        });
      }
    };
  });
