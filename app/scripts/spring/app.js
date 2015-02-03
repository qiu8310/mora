angular.module('mora.ui', []);
angular
  .module('moraApp', [
    'mora.ui',
    'ngAnimate',
    'ngTouch',
    'ngRoute'
  ])
  .config(function (C, $locationProvider, $httpProvider, $sceDelegateProvider, $routeProvider) {

    C.app.set('spring', {allowAccessFrom: ['lls', 'wechat']});


    var basePath = C.app.basePath;


    $locationProvider.html5Mode(C.app.html5Mode).hashPrefix(C.app.hashPrefix);

    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http://*.clouddn.com/**',
      'http://*.qiniudn.com/**'
    ]);

    $httpProvider.interceptors.push('HttpInterceptor');
    $httpProvider.defaults.transformRequest = function(query) { return ng.buildQuery(query); };
    angular.extend($httpProvider.defaults.headers.post, {'Content-Type': 'application/x-www-form-urlencoded'});
    angular.extend($httpProvider.defaults.headers.put, {'Content-Type': 'application/x-www-form-urlencoded'});


    $routeProvider
      .when(basePath, {
        controller: 'SpringHomeCtrl',
        templateUrl: 'views/spring/home.html'
      })
      .when(basePath + '/game', {
        controller: 'SpringGameCtrl',
        templateUrl: 'views/spring/game.html'
      })
      .when(basePath + '/game-success/:id', {
        controller: 'SpringGameSuccessCtrl',
        templateUrl: 'views/spring/game-success.html',
        resolve: {prize: function(Prize, $route) {return Prize.get($route.current.params.id);}}
      })
      .when(basePath + '/game-error', {
        controller: 'SpringGameErrorCtrl',
        templateUrl: 'views/spring/game-error.html'
      })
      .when(basePath + '/prizes', {
        controller: 'SpringPrizesCtrl',
        templateUrl: 'views/spring/prizes.html'
      })
      .when(basePath + '/prize/:id', {
        controller: 'SpringPrizeCtrl',
        templateUrl: 'views/spring/prize.html',
        resolve: {prize: function(Prize, $route) {return Prize.get($route.current.params.id);}}
      })
      .when(basePath + '/prize/open/:id', {
        controller: 'SpringPrizeOpenCtrl',
        templateUrl: 'views/spring/prize-open.html'
      })
      .when(basePath + '/card/:id', {
        controller: 'SpringCardCtrl',
        templateUrl: 'views/spring/card.html',
        resolve: {prize: function(Prize, $route) {return Prize.get($route.current.params.id);}}
      })
      .when(basePath + '/course/:id', {
        controller: 'SpringCourseCtrl',
        templateUrl: 'views/spring/course.html',
        resolve: {prize: function(Prize, $route) {return Prize.get($route.current.params.id);}}
      })
      .when(basePath + '/info', {
        controller: 'SpringInfoCtrl',
        templateUrl: 'views/spring/info.html'
      })
      .otherwise(C.app.mainPage);

  })
  .run(function(Env, $rootScope, $location) {

    // 强制运行一下 Env，让它里面的变量都生效
    ng.info('run at', Env.now());

    var G = Env.G;

    // 伪造数据
    if (Env.isLocal && !G.currentUser) {
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
      Env.path('/game');
    };

  });
