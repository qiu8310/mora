angular.module('cheApp')
  .controller('RootCtrl', function($scope, Env, C, $window, $location, http) {
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

    $scope.setTitle = function(title) {
      if (isWechat || isAlipay) {
        docTitle.textContent = title;
      } else {
        headerTitle.textContent = title;
      }
    };

    $scope.$on('$routeChangeStart', function(e, toRoute, fromRoute) {
      var title = (toRoute.$$route && toRoute.$$route.data || {title: C.app.title}).title,
        shortTitle = title.split(/\s*-/).shift();

      if (shortTitle) {
        $scope.setTitle(shortTitle);
      }

    });

    $scope.$on('$routeChangeSuccess', function(e, currentRoute, lastRoute) {
      lastPath = lastRoute && lastRoute.$$route.originalPath;
      currentPath = currentRoute.$$route.originalPath;

      $scope.isMainPage = currentPath === C.app.mainPage;
      $scope.isDetailPage = currentPath.indexOf('/line/') === 0;
      if (currentRoute.$$route.controller === 'LineListCtrl') {
        $scope.showHeader = false;
      } else {
        $scope.showHeader = !isWechat && !isAlipay;
      }


      if (!Env.cityId && currentPath !== '/switchCity') {
        $location.path('/switchCity');
      }
    });

    $scope.home = function() {
      $location.path(C.app.mainPage);
    };

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


    // 添加与删除收藏
    $scope.fav = function(item) {
      if (item) {
        var type = item.isFav ? 'del' : 'add';
        if (item.nearStation && !item.favStation) {
          item.favStation = item.nearStation;
          item.favStationId = item.nearStationId;
        }

        item.isFav = !item.isFav;
        http.post('api/updatefav', {type: type, fav: JSON.stringify({data: {favlist: [item]}})});
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