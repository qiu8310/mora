'use strict';

angular
  .module('vendors', [])

  // 用 constant 是为了使它可以用在 angular.config 中
  .constant('_', (function() {
    var _ = window._, $ = window.jQuery;

    _.mixin({capitalize: function(string) {
      return string.charAt(0).toUpperCase() + string.substr(1);
    }});

    function walkObject(obj, deep, processFn) {
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
              walkObject(val, deep, processFn) :
              val;
          });

          return result;
        }
      }
      return obj;
    }

    _.mixin({camelCase: function(obj, deep) {
      return walkObject(obj, deep, function(str) {
        return str.replace(/_+([a-z])/g, function(_, letter) { return letter.toUpperCase(); });
      });
    }});

    _.mixin({lineCase: function(obj, deep) {
      return walkObject(obj, deep, function(str) {
        // 如果第一个字符是大写的，则不要在它前面加下划线，直接小写就行了
        return str.replace(/[A-Z]/g, function(letter, index) { return (index ? '-' : '') + letter.toLowerCase(); });
      });
    }});

    _.mixin({underscoreCase: function(obj, deep) {
      return walkObject(obj, deep, function(str) {
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


angular
  .module('moraApp', [
    'ngAnimate',
    'ngCookies',
    'ngSanitize',
    'ui.router',
    'ui.utils',
    'ui.sortable',
    'ui.bootstrap',
    'angular-md5',
    'pasvaz.bindonce',
    'vendors'
  ])
  .config(function (C, _, $stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $sceDelegateProvider) {

    $locationProvider.html5Mode(C.app.html5Mode).hashPrefix(C.app.hashPrefix);

    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http://llss.qiniudn.com/**'
    ]);

    $httpProvider.interceptors.push('HttpInterceptor');

    // 加上一个默认的头部信息（不被七牛接受，无法请求其上的模板文件）
    angular.extend($httpProvider.defaults.headers.common, {
      //'Powered-By': 'Angular-Mora',
      //'Mora-Version': 'v1'
    });


    /*
      自动注册 smart-menu 的 state

     .state('home.forumThread', {
       url: 'forum/thread',
       templateUrl: 'views/partials/forum-thread.html',
       controller: 'ForumThreadCtrl'
     })

     .state('home.manage', {
       url: 'manage',
       templateUrl: 'views/partials/manage.html',
       controller: 'ManageCtrl'
     })
     */
    (function smartMenuAutoState() {
      _.each(C.smartMenu, function(menu) {
        var hasChildren = menu.children && menu.children.length > 0,
          state = 'home.' + menu.key,
          tpl = function(key) {
            return !key ? null : key.indexOf('http://') === 0 ? key : 'views/partials/' + key;
          };
        if (hasChildren) {
          _.each(menu.children, function(subMenu) {
            if (subMenu.manual) {
              return true;
            }
            var keys = [menu.key, subMenu.key];
            $stateProvider.state(state + _.capitalize(subMenu.key), {
              url: '/' + keys.join('/'),
              templateUrl: tpl(subMenu.templateUrl || keys.join('-') + '.html'),
              template: subMenu.template,
              controller: subMenu.controller || _.capitalize(menu.key) + _.capitalize(subMenu.key) + 'Ctrl'
            });
          });
        } else {
          if (!menu.manual) {
            $stateProvider.state(state, {
              url: '/' + menu.key,
              templateUrl:  tpl(menu.templateUrl || menu.key + '.html'),
              template: menu.template,
              controller: menu.controller || _.capitalize(menu.key) + 'Ctrl'
            });
          }
        }
      });
    })();


    $stateProvider
      .state('index', {
        url: '/',
        templateUrl: 'views/index.html',
        data: {
          noNeedLogin: true
        }
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'views/signup.html',
        controller: 'SignupCtrl',
        data: {
          noNeedLogin: true
        }
      })
      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        data: {
          noNeedLogin: true
        }
      })
      .state('home', {
        url: '/crm',
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl'
      })
      .state('home.forumAll', {
        url: '/forum/all',
        templateUrl: 'views/partials/forum-all.html',
        controller: 'ForumAllCtrl',
        resolve: {
          NodeData: ['ForumSer', function(ForumSer) {
            return ForumSer.nodes();
          }]
        }
      })
      .state('home.forumNode', {
        url: '/forum/all',
        templateUrl: 'views/partials/forum-all.html',
        controller: 'ForumNodeCtrl',
        resolve: {
          NodeData: ['ForumSer', function(ForumSer) {
            return ForumSer.nodes();
          }]
        }
      })
      .state('home.userDetail', {
        url: '/user/detail/{id}',
        templateUrl: 'views/partials/user-detail.html',
        controller: 'UserDetailCtrl',
        resolve: {
          UserData: ['UserSer', '$stateParams', function(UserSer, $stateParams) {
            return UserSer.detail($stateParams.id);
          }]
        }
      })
      .state('home.forumDetail', {
        url: '/forum/detail/{id}',
        templateUrl: 'views/partials/forum-detail.html',
        controller: 'ForumDetailCtrl',
        resolve: {
          Thread: ['ForumSer', '$stateParams', function(ForumSer, $stateParams) {
            return ForumSer.thread($stateParams.id);
          }]
        }
      })
      .state('home.teamDetail', {
        url: '/team/detail/{id}',
        templateUrl: 'views/partials/team-detail.html',
        controller: 'TeamDetailCtrl'
      })
      .state('home.podcastAll', {
        url: '/podcast/all',
        templateUrl: 'views/partials/podcast-all.html',
        controller: 'PodcastAllCtrl',
        resolve: {
          NodeData: ['ForumSer', function(ForumSer) {
            return ForumSer.nodes();
          }]
        }
      })
      .state('home.podcastDetail', {
        url: '/podcast/detail/{id}',
        templateUrl: 'views/partials/podcast-detail.html',
        controller: 'PodcastDetailCtrl',
        resolve: {
          NodeData: ['ForumSer', function(ForumSer) {
            return ForumSer.nodes();
          }]
        }
      });


    // 处理重定向
    $urlRouterProvider
      .when('/main', '/')
      .otherwise('/');
  });
