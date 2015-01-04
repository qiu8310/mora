angular.module('cheApp')
  .controller('RootCtrl', function($scope, Env, C, $window, $location) {
    var storeKeyForFooter = 'hideFooter';

    var doc = $window.document,
      sessionStore = $window.sessionStorage,
      lastPath = false,
      currentPath = false,
      isWechat = Env.Platform.isWechat,
      isAlipay = Env.Platform.isAlipay,
      docTitle = doc.querySelector('title'),
      headerTitle = doc.querySelector('.header__title');

    $scope.showHeader = !isWechat && !isAlipay;
    $scope.hideFooter = !!sessionStore[storeKeyForFooter];
    $scope.isMainPage = false;
    $scope.downloadUrl = C.app.download[
      isWechat ? 'wechat' :
        isAlipay ? 'alipay' :
          Env.Mobile.isIOS ? 'ios': 'android'];

    $scope.$on('$routeChangeStart', function(e, toRoute, fromRoute) {
      var title = (toRoute.$$route.data || {title: C.app.title}).title,
        shortTitle = title.split(/\s*-/).shift();

      if (isWechat || isAlipay) {
        docTitle.textContent = shortTitle;
      } else {
        headerTitle.textContent = shortTitle;
      }
    });

    $scope.$on('$routeChangeSuccess', function(e, currentRoute, lastRoute) {
      lastPath = lastRoute && lastRoute.$$route.originalPath;
      currentPath = currentRoute.$$route.originalPath;

      $scope.isMainPage = currentPath === C.app.mainPage;

      if (!Env.cityId && currentPath !== '/switchCity') {
        $location.path('/switchCity');
      }
    });


    $scope.closeFooter = function() {
      $scope.hideFooter = true;
      sessionStore[storeKeyForFooter] = '1';
    };

    // 跳到上一个页面，不是用 history.back
    $scope.goLastPath = function() {
      $location.path(lastPath || C.app.mainPage);
    };

    $scope.back = function() {
      if (lastPath) {
        $window.history.back();
      } else {
        $location.path(C.app.mainPage);
      }
    };


    $scope.getCurrentPosition = function(fn) {
      var navigator = $window.navigator;
      fn = ng.isFunction(fn) ? fn : function(){};

      var fnHandler = function(data) {
        if (data.coords) {
          // coords.latitude  纬度
          // coords.longitude 径度
          fn(false, data.coords);
        } else {
          fn(data || true, null);
        }
        $scope.$apply();
      };

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(fnHandler, fnHandler, {
          timeout: C.app.geolocationTimeout,
          maximumAge: 60000
        });
      } else { fnHandler(); }
    };



  });