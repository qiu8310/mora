angular.module('mora.ui', []);
angular
  .module('moraApp', [
    'mora.ui',
    'ngAnimate',
    'ngTouch',
    'ngRoute'
  ])
  .config(function (C, $locationProvider, $httpProvider, $sceDelegateProvider, $routeProvider) {

    C.app.set('course');
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
        controller: 'CourseHomeCtrl',
        templateUrl: 'views/course/home.html',
        resolve: {
          Data: function(http) {
            return http.get('api/study_plan?ignoreError')
              .then(function(data) { return data.data; }, function() { return false; });
          }
        }
      })
      .when(basePath + '/:uid/charge/:courseIndex', {
        controller: 'CourseChargeCtrl',
        templateUrl: 'views/course/charge.html',
        resolve: {
          Data: function(http, $route, $location) {
            return http.get('api/study_plan?ignoreError&user_id=' + $route.current.params.uid, {cache: true})
              .then(function(data) { return data.data; }, function() { return false; });
          }
        }
      })
      .when(basePath + '/:uid/fighting', {
        controller: 'CourseFightingCtrl',
        templateUrl: 'views/course/fighting.html',
        resolve: {
          Data: function(http, $route, $location) {
            return http.get('api/study_plan?ignoreError&user_id=' + $route.current.params.uid, {cache: true})
              .then(function(data) { return data.data; }, function() { $location.path(C.app.mainPage);});
          }
        }
      })
      .otherwise({
        redirectTo: function() { return C.app.mainPage; }
      });
  })

  .run(function(Env) {

    // 强制运行一下 Env，让它里面的变量都生效
    ng.info('run at', Env.now());
    ng.info('Env', Env);
    Env.L.log(Env.win.location.href);

    if (!Env.G.ASSETS && Env.isLocal) {
      Env.G.currentTimestamp = Math.round(Env.now()/1000);

      //appId=lls&deviceId=357246052044482&sDeviceId=357246052044482&token=f50d31008ce10132ef8b02d26dd0e38e&appVer=2
      Env.G.currentUser = {id: 1842};

      //appId=lls&deviceId=357246052044482&sDeviceId=357246052044482&token=fa7fbd308e820132efa702d26dd0e38e&appVer=2
      //Env.G.currentUser = {id: 2102};
    }

  });
