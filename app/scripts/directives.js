angular.module('cheApp')
  .directive('cityGroup', function() {
    return {
      replace: true,
      templateUrl: 'views/tpl/city-group.html',
      scope: {
        group: '=',
        chose: '='
      }
    };
  })
  .directive('line', function() {
    return {
      replace: true,
      templateUrl: 'views/tpl/line.html',
      scope: {
        line: '='
      }
    };
  })
  .directive('loadMore', function($window, $timeout) {
    return {
      scope: {
        loadMore: '&'
      },
      link: function(scope, element) {

        var BOTTOM_GAP = 50;

        var el = element[0],
          docEl = $window.document.documentElement,
          isLoading = false,

          startLoad = function() {
            isLoading = true;
            element.addClass('load-more-active');
          },
          finishLoad = function() {
            isLoading = false;
            element.removeClass('load-more-active');
          },

          handler = function() {
            if (isLoading) {
              return false;
            }
            var rect = el.getBoundingClientRect();

            if (rect.bottom < docEl.clientHeight + BOTTOM_GAP) {
              var promise = scope.loadMore(),
                promiseFn = promise && (promise.always || promise.finally);
              if (ng.isFunction(promiseFn)) {
                startLoad();
                promiseFn.call(promise, finishLoad);
              }
            }
          };

        $window.addEventListener('scroll', (function(fn, delay) {
          var tid;
          return function() {
            if (tid) {
              $timeout.cancel(tid);
            }
            var args = [].slice.call(arguments), that = this;
            tid = $timeout(function() {
              fn.apply(that, args);
            }, delay);
          };
        })(handler, 150), false);

      }
    };
  })
  .directive('loading', function() {
    return {
      replace: true,
      template: '<div class="loading"><i class="icon"></i></div>',
      link: function (scope, element, attrs) {
        if (attrs.large) {
          element.addClass('loading--large');
        }
      }
    };
  })
  .directive('search', function() {

    return {
      templateUrl: 'views/tpl/search.html',
      replace: true,
      transclude: true,
      scope: {
        handlers: '=',
        options: '='
      },
      controller: function($scope, Storage, C, Env) {
        $scope.keyword = '';
        $scope.isFocus = false;
        $scope.currentCityName = Env.cityName;


        var storageKey = null;
        $scope.history = [];

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
          $scope.blur();
        };

        if (getHandler('onChange')) {
          $scope.$watch('keyword', ng.ignoreFirstCall(function() {
            callHandler('onChange', [].slice.call(arguments));
          }));
        }


        function writeHistoryItem(key) {
          var history = $scope.history;
          var index = history.indexOf(key),
            len = C.app.searchHistoryLength;
          if ( index >= 0 || history.length === len) {
            history.splice(index >= 0 ? index : len - 1, 1);
          }
          history.unshift(key);
          Storage.set(storageKey, history, true);
        }
        function keyword(key) {
          if (ng.isUndefined(key)) {
            return $scope.keyword;
          } else {
            $scope.keyword = key;
          }
        }
        $scope.initStorage = function(key) {
          storageKey = key;
          $scope.history = (Storage.get(storageKey) || []).slice(0, C.app.searchHistoryLength);
        };
        $scope.clearHistory = function() {
          $scope.history = [];
          Storage.del(storageKey);
          $scope.blur();
        };
        $scope.clickHistoryItem = function(key) {
          $scope.keyword = key;
          writeHistoryItem(key);
        };

        // 将一些有用的方法传递回调用者
        if ($scope.handlers) {
          $scope.handlers.writeHistoryItem = writeHistoryItem;
          $scope.handlers.keyword = keyword;
        }
      },

      link: function(scope, el) {
        var opts = ng.extend({
          storageKey: 'searchHistory',
          placeholderText: '搜索线路...',
          submitText: '搜索'
        }, scope.options || {});

        if (opts.keyword) {
          scope.keyword = opts.keyword;
        }
        scope.initStorage(opts.storageKey);
        el.find('.search__button').text(opts.submitText);
        el.find('.search__input').attr('placeholder', opts.placeholderText);
      }
    };

  });