/**
 *
 * @example
 *
 * layout 可以设置在 from 上，这样可以批量设置，而不用在每个 from-control 上设置
 *
    <form-control label="昵称" layout="3-9" feedback="true" ref="nickname">
         <input class="form-control" placeholder="请输入您的昵称"
           name="nickname"
           ng-model="user.nickname"
           range-validate="4-10"
           ng-model-options="{ updateOn: 'default blur', debounce: {'default': 500, 'blur': 0} }"
           required/>
         <p class="help-block on-require-error">请输入您的昵称</p>
         <p class="help-block on-range-error">只能输入4-10个字符</p>
    </form-control>
 *
 */
angular.module('moraApp')
  .directive('formControl', function () {
    return {
      templateUrl: 'views/tpls/form-control.html',
      transclude: true,
      replace: true,
      restrict: 'E',
      require: '^form',
      scope: {
        label: '@',
        ref: '@'
      },
      link: function postLink(scope, element, attrs, formCtrl) {
        scope.feedback = attrs.feedback === undefined || attrs.feedback === true;

        var layout = attrs.layout,
          model = formCtrl[scope.ref],
          formElement;

        if (!layout) {
          formElement = formCtrl.$name && document[formCtrl.$name];
          layout = formElement && formElement.getAttribute('layout');
        }
        scope.layout = (layout || '3-9').split('-');


        scope.controlStatusClass = function() {
          if (!model) {
            return false;
          }
          var classes = {
            'has-error': scope.isErrorStatus(),
            'has-success': scope.isSuccessStatus()
          };

          angular.forEach(model.$error, function(val, key) {
            if (key === 'required' && model.$pristine) {
              val = false;
            }
            classes['has-' + key + '-error'] = val;
          });

          return classes;
        };

        scope.isSuccessStatus = function() {
          return model && model.$valid && model.$dirty;
        };

        scope.isErrorStatus = function() {
          return model && model.$invalid && model.$dirty;
        };

      }
    };
  });
