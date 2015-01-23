angular.module('mora.ui', []);
angular
  .module('moraApp', [
    'mora.ui',
    'ngAnimate',
    'ngTouch',
    'ngRoute'
  ])
  .config(function (C, $locationProvider, $httpProvider, $sceDelegateProvider, $routeProvider) {

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
    angular.extend($httpProvider.defaults.headers.common, {
      //'Powered-By': 'Angular-Mora',
      //'Mora-Version': 'v1'
    });

    $routeProvider
      .when('/spring', {
        controller: 'SpringHomeCtrl',
        templateUrl: 'views/spring/home.html'
      })
      .when('/spring/game', {
        controller: 'SpringGameCtrl',
        templateUrl: 'views/spring/game.html'
      })
      .when('/spring/game-success/:id', {
        controller: 'SpringGameSuccessCtrl',
        templateUrl: 'views/spring/game-success.html',
        resolve: {prize: function(Prize, $route) {return Prize.get($route.current.params.id);}}
      })
      .when('/spring/game-error', {
        controller: 'SpringGameErrorCtrl',
        templateUrl: 'views/spring/game-error.html'
      })
      .when('/spring/prizes', {
        controller: 'SpringPrizesCtrl',
        templateUrl: 'views/spring/prizes.html'
      })
      .when('/spring/prize/:id', {
        controller: 'SpringPrizeCtrl',
        templateUrl: 'views/spring/prize.html',
        resolve: {prize: function(Prize, $route) {return Prize.get($route.current.params.id);}}
      })
      .when('/spring/prize/open/:id', {
        controller: 'SpringPrizeOpenCtrl',
        templateUrl: 'views/spring/prize-open.html'
      })
      .when('/spring/card/:id', {
        controller: 'SpringCardCtrl',
        templateUrl: 'views/spring/card.html',
        resolve: {prize: function(Prize, $route) {return Prize.get($route.current.params.id);}}
      })
      .when('/spring/course/:id', {
        controller: 'SpringCourseCtrl',
        templateUrl: 'views/spring/course.html',
        resolve: {prize: function(Prize, $route) {return Prize.get($route.current.params.id);}}
      })
      .otherwise(C.app.mainPage);

  })
  .run(function(Env, $rootScope, $location) {

    // 强制运行一下 Env，让它里面的变量都生效
    ng.info('run at', Env.now());


    var G = Env.G;

    // 伪造数据
    if (Env.isLocal) {
      var uid = Env.QUERY.refreshToken || 'r_' + Env.now();
      Env.Platform.isWechat = true;
      G.currentUser = {
        id: 'weixin:openid-' + uid,
        refreshToken: uid
      };
      G.huodong = {};
      Env.win.G = G;
    }

    ng.info('Env', Env);
    Env.L.log(Env.win.location.href);

    $rootScope.goToGame = function() {
      $location.path('/spring/game');
    };

  });
