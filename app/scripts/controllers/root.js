angular.module('mora.ui')
  .controller('RootCtrl', function($scope, Env, $location, $timeout) {

    var doc = Env.doc,
      C = Env.C,
      lastPath = false,
      currentPath = false,
      isWechat = Env.Platform.isWechat,
      isAlipay = Env.Platform.isAlipay;

    $scope.showHeader = !isWechat && !isAlipay;
    $scope.isMainPage = false;
    $scope.downloadUrl = C.app.download[
      isWechat ? 'wechat' :
        isAlipay ? 'alipay' :
          Env.Mobile.isIOS ? 'ios': 'android'];

    $scope.$on('$routeChangeStart', function(e, next, cur) {

    });

    // happened after routeChangeSuccess
    $scope.loaded = function() {

    };

    $scope.$on('$routeChangeSuccess', function(e, cur, prev) {
      var prevRoute = prev && prev.$$route || {},
        curRoute = cur && cur.$$route || {};

      ng.info('Controller', curRoute.controller);

      if (!cur.$$route) { return true; }

      lastPath = prevRoute.originalPath;
      currentPath = curRoute.originalPath;

      $scope.isMainPage = currentPath === C.app.mainPage;

      var cls = ng.lineCase(curRoute.controller);
      $scope.rootClass = cls + ' ' + cls.split('-').shift() + '-page';

      // 设置页面的 Title (如果有的话)
      var title = curRoute.data && curRoute.data.title || C.app.title;
      if (title) {
        $scope.setTitle(title.split(/\s*-/).shift());
      }

    });

    $scope.setTitle = function(title) {
      if (isWechat || isAlipay) { doc.title = title; }
    };

    $scope.goHome = function() {
      $location.path(C.app.mainPage);
    };

    // 跳到上一个页面，不是用 history.back
    $scope.goBack = function() {
      $location.path(lastPath || C.app.mainPage);
    };

    $scope.back = function() {
      if (lastPath) {
        Env.win.history.back();
      } else {
        $location.path(C.app.mainPage);
      }
    };





  });