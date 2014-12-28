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
    $httpProvider.defaults.transformRequest = function(query) {
      return ng.buildQuery(query);
    };
    angular.extend($httpProvider.defaults.headers.post, {
      'Content-Type': 'application/x-www-form-urlencoded'
    });

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
      .when('/lineSearch', {
        controller: 'LineSearchCtrl',
        templateUrl: 'views/lineSearch.html'
      })
      .when('/choseStation', {
        controller: 'ChoseStationCtrl',
        templateUrl: 'views/choseStation.html'
      })
      .when('/myFavicon', {
        controller: 'MyFaviconCtrl',
        templateUrl: 'views/myFavicon.html'
      })
      .when('/lineAround', {})

      .otherwise('/lineSearch');

  })
  .run(function(Env, Auth) {

    // 强制运行一下 Env，让它里面的变量都生效
    ng.info('run at', Env.now());

    // 生成 UID
    var auth = Auth.get();
    if (!auth || !auth.uid) {
      // TODO
      if (Env.Platform.isWechat) {
        auth = Auth.set({uid: 'wechat_' + Env.now()});
      } else if (Env.Platform.isAlipay) {
        auth = Auth.set({uid: 'alipay_' + Env.now()});
      } else {
        auth = Auth.set({uid: 'browser_' + Env.now()});
      }
    }

  });
