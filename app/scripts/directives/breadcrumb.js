angular.module('moraApp')
  .directive('breadcrumb', function() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'views/tpls/breadcrumb.html',
      controller: function($scope, C, _, $state) {

        function getBreadcrumb(url) {
          url = url.replace(/^\s*\/|\/\s*$/g, '');

          $scope.breadcrumb = ['Home'];

          if (url !== '') {
            var menus = C.smartMenu;

            _.each(url.split('/'), function(key) {

              var menu = _.find(menus, {key: key});

              if (menu) {
                $scope.breadcrumb.push(menu.title);
                menus = menu.children;
              }
            });
          }
        }

        getBreadcrumb($state.current.url);
        $scope.$on('$stateChangeSuccess', function(e, current) {
          getBreadcrumb(current.url);
        });
      },

      link: function postLink(scope) {

      }
    };

  });