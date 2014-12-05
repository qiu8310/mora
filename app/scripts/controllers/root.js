'use strict';

angular.module('moraApp')
  .controller('RootCtrl', function ($scope, $rootScope, _, Storage, $state, Dialog, Auth) {

    $scope.$on('login:required', function() {
      Auth.clearToken();
      $state.go('login');
    });
    $scope.$on('HTTPError', function(e, msg) {
      //Dialog.alert(msg);
      console.error(msg);
    });

    var redirect = null;

    // 除了了指定的 noNeedLogin，其它都需要登录
    $scope.$on('$stateChangeStart', function(e, next, nextParams) {
      if (!Auth.hasToken() && !(next.data && next.data.noNeedLogin)) {
        redirect = [next.name, nextParams, 'changeStart'];
        $state.go('login');
        e.preventDefault();
      }
    });

    // 登录成功就跳转到上一页面（没有上一页面就跳到主页）
    function back() {
      if (redirect && redirect[0] !== 'login') {
        $state.go(redirect[0], redirect[1]);
      } else {
        $state.go(Auth.hasToken() ? 'home' : 'index');
      }
    }


    $scope.$on('$stateChangeSuccess', function(e, current, params, prev, prevParams) {
      if (!redirect || !redirect[2]) {
        redirect = [prev.name, prevParams];
      }

      if (current.name === 'login' && Auth.hasToken()) {
        back();
      }
    });
    $scope.$on('login:success', back);


    // 登出
    $scope.logout = function() {
      Auth.clearToken();
      $state.go('index');
    };



    // 分页参数
    $scope.pager = {
      page: 1,
      total: 0,
      pageSize: 5
    };








    // layout 相关的配置
    $scope.layoutOptions = Storage.get('layoutOptions', {
      fixHeader: true,
      fixFooter: true,
      hideAside: false,
      fixAside: true,
      fixBreadcrumb: true,
      container: false
    });


    // 互斥的属性
    var layoutMutexOptions = {
      fixBreadcrumb: ['!container', 'fixHeader'],
      container: ['!fixBreadcrumb', '!fixHeader', '!fixAside'],
      '!fixHeader': ['!fixBreadcrumb'],
      fixAside: ['!container']
    };



    $scope.$watch('layoutOptions', function(opts, oldOpts) {
      // 修改互斥的属性
      var updated = false;

      _.each(opts, function(currValue, key) {
        if (currValue !== oldOpts[key] && typeof currValue === 'boolean') {
          var mutexValues = layoutMutexOptions[(currValue ? '' : '!') + key];
          _.each(mutexValues, function(prefixedKey) {
            var val;
            key = prefixedKey.replace('!', '');
            val = prefixedKey.charAt(0) !== '!';

            if (opts[key] !== val) {
              opts[key] = val;
              updated = true;
            }
          });
        }
      });

      // 更新了值，马上又会触发 watch，所以返回即可
      if (updated) {
        return true;
      }

      $scope.layoutClasses = _.reduce(opts, function(result, val, key) {
        return result + (val ? ' ' + key.replace(/[A-Z]/g, function(letter){ return '-' + letter.toLowerCase();}) : '');
      }, '');

      Storage.set('layoutOptions', opts);

    }, true);





    // 所有支持的页面翻页效果
    var effectPairs = [
      'bounce', 'fade', 'zoom', ['flipInX', 'flipOutX'], ['flipInY', 'flipOutY'],
      ['rotateIn', 'rotateOut'], ['lightSpeedIn', 'lightSpeedOut'], ['rollIn', 'rollOut'],
      ['rotateInDownLeft', 'rotateOutDownLeft'], ['rotateInDownRight', 'rotateOutDownRight'],
      ['rotateInUpLeft', 'rotateOutUpLeft'], ['rotateInUpRight', 'rotateOutUpRight']
    ];

    (function normalizeEffectPairs() {
      var pairs = [];
      _.each(effectPairs, function(pair) {
        if (_.isArray(pair)) {
          pairs.push(pair);
        } else if (_.isString(pair)) {
          pairs.push([pair + 'In', pair + 'Out']);
          _.each(['Down', 'Up', 'Left', 'Right'], function(direction, index, ref) {
            var oppositeIndex = index % 2 ? index - 1 : index + 1;
            pairs.push([pair + 'In' + direction, pair + 'Out' + ref[oppositeIndex]]);
          });
        }
      });
      effectPairs = pairs;
    })();

    $scope.effectPairs = effectPairs;

  });
