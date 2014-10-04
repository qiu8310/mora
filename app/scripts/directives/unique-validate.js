/**
 *
 * @example
 *  <input type="email" unique-field="[table].[field]|[timeout]" />
 *
 */
angular.module('moraApp')
  .directive('uniqueValidate', function ($timeout, $parse, $http) {
    return {
      require: '?ngModel',
      restrict: 'A',
      link: function postLink(scope, element, attrs, model) {

        if (!model) {
          return ;
        }

        var sid, table, field, timeout = 500,
          tableField = attrs.uniqueValidate.replace(/\s+/, '').split('.');

        if (tableField.length !== 2) {
          throw new Error('uniqueValidate directive should set to: unique-field="[table].[field]"');
        }

        table = tableField[0];
        field = tableField[1];
        if (field.indexOf('|') > 0) {
          field = field.split('|');
          timeout = parseInt(field.pop(), 10) || timeout;
          field = field.shift();
        }


        function handler() {
          var modelValue = $parse(attrs.ngModel)(scope),
            path = table + '/exist',
            data = {};
          data[field] = modelValue;

          $http
            .post(path, data)
            .success(function() { model.$setValidity('unique', false); })
            .error(function() {   model.$setValidity('unique', true); });
        }

        scope.$watch(attrs.ngModel, function(modelValue) {
          if (modelValue === undefined || modelValue === '') {
            return false;
          }
          if (sid) {
            $timeout.cancel(sid);
          }
          sid = $timeout(handler, timeout, true);
        });
      }
    };
  });
