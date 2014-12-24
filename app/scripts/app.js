'use strict';
/*
angular
  .module('vendors', [])

  // 用 constant 是为了使它可以用在 angular.config 中
  .constant('_', (function() {
    var _ = window._, $ = window.jQuery;

    _.mixin({capitalize: function(string) {
      return string.charAt(0).toUpperCase() + string.substr(1);
    }});


    function work(obj, deep, processFn) {
      if (deep === undefined) {
        deep = true;
      }
      if (_.isString(obj)) {
        return processFn(obj);
      } else {
        var result,
          isArray = _.isArray(obj),
          isObject = _.isPlainObject(obj);
        if (isArray || isObject) {
          result = isArray ? [] : {};

          _.each(obj, function(val, key) {
            if (isObject) {
              key = processFn(key);
            }

            result[key] = deep && (_.isArray(val) || _.isPlainObject(val)) ?
              work(val, deep, processFn) :
              val;
          });

          return result;
        }
      }
      return obj;
    }

    _.mixin({camelCase: function(obj, deep) {
      return work(obj, deep, function(str) {
        return str.replace(/_+([a-z])/g, function(_, letter) { return letter.toUpperCase(); });
      });
    }});

    _.mixin({lineCase: function(obj, deep) {
      return work(obj, deep, function(str) {
        // 如果第一个字符是大写的，则不要在它前面加下划线，直接小写就行了
        return str.replace(/[A-Z]/g, function(letter, index) { return (index ? '-' : '') + letter.toLowerCase(); });
      });
    }});

    _.mixin({underscoreCase: function(obj, deep) {
      return work(obj, deep, function(str) {
        // 如果第一个字符是大写的，则不要在它前面加下划线，直接小写就行了
        return str.replace(/[A-Z]/g, function(letter, index) { return (index ? '_' : '') + letter.toLowerCase(); });
      });
    }});

    _.mixin({ignoreFirstCall: function(fn) {
      var cb = null;
      return function() {
        if (cb) {
          cb.apply(null, arguments);
        } else {
          cb = fn;
        }
      };
    }});


    (function registerAsyncClickToLoDash() {
      function isTextNode(el) {
        return $.trim(el.text()) && el.children().length === 0;
      }

      function findTextNode(el) {
        var find = null;
        if (isTextNode(el)) { return el; }

        el.children().each(function() {
          if (find) { return false; }

          var el = $(this);
          find = isTextNode(el) ? el : findTextNode(el);
        });

        return find;
      }

      _.mixin({asyncClickOn: function(element, fn, options) {
        options = options || {};
        element = $(element);

        var promise,
          textNode = findTextNode(element),
          originalText = textNode.text(),
          asyncText = options.asyncText || originalText + '...',
          asyncClass = options.asyncClass || 'disabled',
          asyncTarget = options.asyncTarget && $(options.asyncTarget);

        if (element.hasClass(asyncClass)) {
          return false;
        }
        if (options.asyncConfirm && !window.confirm(options.asyncConfirm)) {
          return false;
        }

        asyncClass += ' async-loading';
        asyncTarget = asyncTarget && asyncTarget.length ? asyncTarget.eq(0) : null;


        var spinElement;

        function start() {
          textNode.text(asyncText);
          element.addClass(asyncClass);
          if (asyncTarget) {
            spinElement = $('<div class="async-loading"><i class="fa fa-spinner fa-2x fa-spin"></i></div>');
            var style = {
              width: asyncTarget.width(),
              height: asyncTarget.height()
            };
            spinElement.css(style);
            spinElement.find('.fa').css({
              marginLeft: style.width / 2 - 8,
              marginTop: Math.min(style.height / 2 - 8, 100)
            });


            asyncTarget.fadeOut(300, function() {
              asyncTarget.before(spinElement);
            });
          }
        }

        function finish() {
          textNode.text(originalText);
          element.removeClass(asyncClass);
          if (asyncTarget) {
            spinElement.remove();
            spinElement = null;
            asyncTarget.fadeIn(500);
          }
        }


        element[0].blur();
        promise = fn.apply(options.context, options.args || []);

        // promise 结束时的回调
        var promiseFn = promise && (promise.always || promise.finally);
        if (typeof promiseFn === 'function') {
          start();
          promiseFn.call(promise, finish);
        }

      }});

    })();


    return _;
  })())

  .factory('$', function() {
    return window.$;
  });
*/

angular
  .module('cheApp', [
    'ngAnimate',
    'ngTouch',
    'ngRoute'
  ])
  .config(function (C, $locationProvider, $httpProvider, $sceDelegateProvider, $routeProvider) {

    $locationProvider.html5Mode(C.app.html5Mode).hashPrefix(C.app.hashPrefix);

    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http://*.qiniudn.com/**'
    ]);

    $httpProvider.interceptors.push('HttpInterceptor');

    // 加上一个默认的头部信息（不被七牛接受，无法请求其上的模板文件）
    angular.extend($httpProvider.defaults.headers.common, {
      //'Powered-By': 'Angular-Mora',
      //'Mora-Version': 'v1'
    });

    $routeProvider
      .when('/switchCity', {
        controller: 'SwitchCityCtrl',
        templateUrl: 'views/switchCity.html'
      })
      .when('/lineSearch', {})
      .when('/lineAround', {})
      .when('/choseStation', {})
      .when('/myFavicon', {})

      .otherwise('/switchCity');



  });
