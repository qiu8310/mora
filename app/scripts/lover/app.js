angular.module('mora.ui', []);
angular
  .module('moraApp', [
    'mora.ui',
    'ngAnimate',
    'ngTouch',
    'ngRoute'
  ])
  .config(function (C, $locationProvider, $httpProvider, $sceDelegateProvider, $routeProvider) {

    C.app.mainPage = '/lover';

    $locationProvider.html5Mode(C.app.html5Mode).hashPrefix(C.app.hashPrefix);

    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http://*.clouddn.com/**',
      'http://*.qiniudn.com/**'
    ]);

    $httpProvider.interceptors.push('HttpInterceptor');
    $httpProvider.defaults.transformRequest = function(query) {
      return ng.buildQuery(query);
    };
    angular.extend($httpProvider.defaults.headers.post, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });
    angular.extend($httpProvider.defaults.headers.put, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });

    // 加上一个默认的头部信息（不被七牛接受，无法请求其上的模板文件）
    //angular.extend($httpProvider.defaults.headers.common, {
      //'Powered-By': 'Angular-Mora',
      //'Mora-Version': 'v1'
    //});

    $routeProvider
      .when('/lover', {
        controller: 'LoverHomeCtrl',
        templateUrl: 'views/lover/home.html'
      })
      .when('/lover/letter', {
        controller: 'LoverLetterCtrl',
        templateUrl: 'views/lover/letter.html'
      })
      .otherwise(C.app.mainPage);

  })
  .run(function(Env, $rootScope, $location) {

    // 强制运行一下 Env，让它里面的变量都生效
    ng.info('run at', Env.now());
    ng.info('Env', Env);
    Env.L.log(Env.win.location.href);

  });
