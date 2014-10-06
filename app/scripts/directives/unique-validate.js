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

        var table, field,
          tableField = attrs.uniqueValidate.replace(/\s+/, '').split('.');

        if (tableField.length !== 2) {
          throw new Error('uniqueValidate directive should set to: unique-field="[table].[field]"');
        }

        table = tableField[0];
        field = tableField[1];

        scope.$watch(attrs.ngModel, function(modelValue) {

          if (model.$isEmpty(modelValue)) {
            return false;
          }

          var path = table + '/exist',
            data = {};
          data[field] = modelValue;
          model.$setValidity('unique', null);
          $http
            .post(path, data)
            .success(function() { model.$setValidity('unique', false); })
            .error(function() {   model.$setValidity('unique', true); });

        });
      }
    };
  });
