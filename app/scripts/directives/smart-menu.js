/**
 *
 * @example
 *
 */
angular.module('moraApp')
  .directive('smartMenu', function (C, _, $, Storage, $state) {

    function isCurrentMenu(menu) {
      return currentTopMenuKey() === menu.key;
    }

    function currentTopMenuKey() {
      return $state.current && $state.current.url.split('/')[1];
    }

    return {
      templateUrl: 'views/tpls/smart-menu.html',
      replace: true,
      restrict: 'E',
      controller: function($scope, $timeout) {
        $scope.toggleMenu = function(e, menu){
          var target = $(e.target),
            subMenuEl = (target.is('a') ? target : target.parentsUntil('li')).next();

          _.each($scope.menus, function(m) {
            var oldOpenedEl = $('.menu__parent-ul .open ul');
            if (oldOpenedEl.get(0) !== subMenuEl.get(0)) {
              oldOpenedEl.slideUp(200);
            }
            if (m !== menu) {
              m.isOpen = false;
            }
          });

          if (menu.hasChildren) {
            menu.isOpen = !menu.isOpen;
          }

          subMenuEl.slideToggle(200);

        };

        // 记录最顶层 active 的 Menu 的 key，用于设置对应的 DOM 的 class 为 active
        $timeout(function() {
          $scope.activeMenu = currentTopMenuKey();
          $scope.$on('$stateChangeSuccess', function() {
            $scope.activeMenu = currentTopMenuKey();
          });
        }, 0);
      },


      link: function postLink(scope, element, attrs) {

        // 得到所有当前配置的 menus
        var menus = _.map(C.smartMenu, function(menu) {
          var result = _.clone(menu);

          // 最顶层菜单专用的属性
          result.hasChildren = result.children && result.children.length > 0;
          result.isOpen = isCurrentMenu(menu);
          result.newCount = 0; // 有更新的数量

          // 如果设置一个不存在的 stateName, ui-route 则不会设置 href 属性，如果设置 sref 为空字符串, ui-route 会报错
          result.sref = result.hasChildren ? '__notExist' : 'home.' + result.key;

          result.children = _.map(menu.children || [], function(subMenu) {
            subMenu = _.clone(subMenu);
            subMenu.sref = 'home.' + result.key + _.capitalize(subMenu.key);
            return subMenu;
          });

          return result;
        });


        function walkMenus(fn) {
          var result = [];
          _.each(menus, function(menu) {
            result.push(fn(menu, null));
            _.each(menu.children, function(subMenu) {
              result.push(fn(subMenu, menu));
            });
          });
          return result;
        }


        // 获取当前所有的 menuKeys
        var menuKeys = walkMenus(function(menu, parentMenu) {
          return parentMenu ? parentMenu.key + '.' + menu.key : menu.key;
        });


        // 判断上次有更新之后 到 当前时间是否超过了期限
        var now = _.now(),
          storedMenuKeys = Storage.get('storedMenuKeys', menuKeys),
          latestUpdateMenuKeysTime = Storage.get('latestUpdateMenuKeysTime', now),
          isNewTagExpired;

        isNewTagExpired = now - latestUpdateMenuKeysTime > C.menu.newTagMaxAge;

        // 判断 menu 是否是最新的
        var allMenuStatus = walkMenus(function(menu, parentMenu) {
          var key = parentMenu ? parentMenu.key + '.' + menu.key : menu.key;
          menu.isNew = !menu.hasChildren && _.indexOf(storedMenuKeys, key) < 0;
          if (menu.isNew && parentMenu) {
            parentMenu.newCount++;
          }
          return menu.isNew;
        });


        // 更新缓存
        if (isNewTagExpired) {
          Storage.set('latestUpdateMenuKeysTime', now);
          if (_.some(allMenuStatus)) {
            Storage.set('storedMenuKeys', menuKeys);
          }
        }

        scope.menus = menus;
      }
    };
  });
