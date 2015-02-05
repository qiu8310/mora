angular.module('mora.ui', []);
angular
  .module('moraApp', [
    'mora.ui',
    'ngAnimate',
    'ngTouch',
    'ngRoute'
  ])
  .config(function (C, $locationProvider, $httpProvider, $sceDelegateProvider, $routeProvider) {

    C.app.set('lover');
    var basePath = C.app.basePath;

    $locationProvider.html5Mode(C.app.html5Mode).hashPrefix(C.app.hashPrefix);

    $sceDelegateProvider.resourceUrlWhitelist([
      'self',
      'http://*.clouddn.com/**',
      'http://*.qiniudn.com/**'
    ]);

    $httpProvider.interceptors.push('HttpInterceptor');
    $httpProvider.defaults.transformRequest = function(query) { return ng.buildQuery(query); };
    ng.extend($httpProvider.defaults.headers.post, {'Content-Type': 'application/x-www-form-urlencoded'});
    ng.extend($httpProvider.defaults.headers.put, { 'Content-Type': 'application/x-www-form-urlencoded'});

    // 加上一个默认的头部信息（不被七牛接受，无法请求其上的模板文件）
    //angular.extend($httpProvider.defaults.headers.common, {
      //'Powered-By': 'Angular-Mora',
      //'Mora-Version': 'v1'
    //});

    $routeProvider
      .when(basePath, {
        controller: 'LoverHomeCtrl',
        templateUrl: 'views/lover/home.html'
      })
      .when(basePath + '/letter', {
        controller: 'LoverLetterCtrl',
        templateUrl: 'views/lover/letter.html',
        resolve: {
          Data: function(http, Env) {
            var path = 'api/userinfo' + (Env.QUERY.uid ? '?userId=' + Env.QUERY.uid : '');
            return http.get(path, {cache: true}).then(function(d) { return d.data; });
          }
        }
      })
      .otherwise({
        redirectTo: function() {
          return C.app.mainPage;
        }
      });

  })
  .run(function(Env) {

    // 强制运行一下 Env，让它里面的变量都生效
    ng.info('run at', Env.now());
    ng.info('Env', Env);
    Env.L.log(Env.win.location.href);


    if (!Env.G.ASSETS && Env.isTest) {
      Env.G.ASSETS = {
        images: {
          'hill.png': 'http://localhost:9999/images/lover/hill.png',
          'tree-lines.png': 'http://localhost:9999/images/lover/tree-lines.png'
        },
        views: {
          'letter.html' : 'views/lover/letter.html'
        }
      };
      Env.G.currentTimestamp = Math.round(Env.now()/1000);
    }

  });
