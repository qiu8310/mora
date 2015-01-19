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
  .directive('lineDetailScroll', function() {
    return {
      scope: {
        lineDetailScroll: '=',
        stations: '='
      },
      link: function(scope, element) {
        var scrollElement = element[0].parentNode;

        scope.$watch('stations.length + "|" + lineDetailScroll', function() {

          var stations = scope.stations;
          var index = scope.lineDetailScroll;
          if (!stations) { return false; }

          var roadLen = (stations.length - 1) * 54;

          element.css('width', roadLen + 60 + 'px');
          element.find('.list').css('width', roadLen + 'px');
          element.removeClass('hidden');


          var x = 30 + index * 54; // 目标点的距离
          var w = document.documentElement.clientWidth; // 屏幕宽度
          setTimeout(function() {
            scrollElement.scrollLeft = Math.round(x - w * 0.5); // 将 x 移动屏幕中心
          }, 200);

        });
      }
    };
  })
  .directive('lineDetail', function() {
    return {
      scope: {
        lineDetail: '='
      },
      link: function(scope, element) {
        var detail = scope.lineDetail;
        var makeDom = function(cls, num) {
          var span = document.createElement('span');
          span.classList.add(cls);
          if (num > 1) {
            var i = document.createElement('i');
            i.textContent = num;
            span.appendChild(i);
          }
          return span;
        };
        if (detail.arrivalNum > 0) {
          element[0].appendChild(makeDom('bus-here', detail.arrivalNum));
        }
        if (detail.onTheWayNum > 0) {
          element[0].appendChild(makeDom('bus-coming', detail.onTheWayNum));
        }
      }
    };
  })
  .directive('distance', function() {
    return {
      scope: {
        item: '='
      },
      link: function(scope, element) {
        var item = scope.item;
        var cls = false,
          txt = '',
          left = item.leftStopNum;

        if (item.result !== 0) {
          cls = 'distance--no-line';
          txt = '已停运';
        } else if (left === -2) {
          cls = 'distance--no-line';
          txt = '暂无数据';
        } else if (left === -1) {
          txt = '等待发车';
        } else if (left === 0) {
          cls = 'distance--coming';
          txt = '已到站';
        } else if (left === 1) {
          cls = 'distance--coming';
          txt = '即将到站';
        } else {
          txt = left + '站';
        }


        if (cls) {
          element.addClass(cls);
        }
        element.text(txt);
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
      template: '<div class="loading f-14 fg-6"><p class="loading__text"></p></div>',
      link: function (scope, element, attrs) {
        if (attrs.large) {
          element.addClass('loading--large');
        }
        if (attrs.text) {
          element.find('.loading__text').text(attrs.text);
        }
      }
    };
  })
  .directive('search', function($location) {

    return {
      templateUrl: 'views/tpl/search.html',
      replace: true,
      transclude: true,
      scope: {
        handlers: '=',
        options: '='
      },
      controller: function($scope, Storage, C, Env, $location) {
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

        $scope.switchCity = function() {
          $location.path('/switchCity');
        };

        if (getHandler('onChange')) {
          $scope.$watch('keyword', ng.ignoreFirstCall(function() {
            callHandler('onChange', [].slice.call(arguments));
          }));
        }



        function writeHistoryItem(item) {
          var save = {lineNo: item.lineNo, lineName: item.lineName, direction: item.direction};

          var history = $scope.history;
          var index, len = C.app.searchHistoryLength;

          ng.forEach(history, function(h, i) {
            if (h.lineName === save.lineName) {
              index = i;
              return false;
            }
          });

          if ( index >= 0 || history.length === len) {
            history.splice(index >= 0 ? index : len - 1, 1);
          }
          history.unshift(save);
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
        $scope.clickHistoryItem = function(item) {
          writeHistoryItem(item);
          $location.path('/line/' + item.lineNo + '/' + item.direction);
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