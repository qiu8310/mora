angular.module('cheApp')
  .directive('search', function() {

    return {
      templateUrl: 'views/tpl/search.html',
      restrict: 'E',
      replace: true,
      scope: {
        handlers: '=',
        options: '='
      },
      controller: function($scope) {
        $scope.keyword = '';
        $scope.isFocus = false;


        $scope.handlers.keyword = function(val) {
          if (ng.isDefined(val)) {
            $scope.keyword = val;
          } else {
            return $scope.keyword;
          }
        };

        function getHandler (key) {
          var fn = $scope.handlers && $scope.handlers[key];
          return fn && ng.isFunction(fn) ? fn : null;
        }
        function callHandler (key, args) {
          var fn = getHandler(key);
          if (fn) {
            fn.apply($scope, args && [].concat(args) || []);
          }
        }

        $scope.search = function() {
          if ($scope.keyword) {
            callHandler('onSearch', $scope.keyword);
          }
        };

        $scope.focus = function() {
          if (!$scope.isFocus) {
            $scope.isFocus = true;
            callHandler('onFocus');
          }
        };

        $scope.blur = function() {
          if (!$scope.keyword && $scope.isFocus) {
            $scope.isFocus = false;
            callHandler('onBlur');
          }
        };

        $scope.cancel = function() {
          callHandler('onCancel', $scope.keyword);
          $scope.isFocus = false;
          $scope.keyword = '';
        };

        if (getHandler('onChange')) {
          $scope.$watch('keyword', ng.ignoreFirstCall(function() {
            callHandler('onChange', [].slice.call(arguments));
          }));
        }
      },

      link: function(scope, el) {
        var opts = ng.extend({
          placeholderText: '搜索线路...',
          submitText: '搜索'
        }, scope.options || {});

        el.find('.search__button').text(opts.submitText);
        el.find('.search__input').attr('placeholder', opts.placeholderText);
      }
    };

  });