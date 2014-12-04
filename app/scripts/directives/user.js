angular.module('moraApp')
  .directive('user', function ($state, C) {

    return {
      restrict: 'A',
      scope: {
        user: '='
      },
      link: function(scope, element, attrs) {
        var destroy = scope.$watch('user', function(user) {
          if (user) {
            destroy();

            var username = user.name,
              avatar = user.imageUrl || C.res.defaultAvatar;

            element.attr('href', $state.href('home.userDetail', {id: user.resourceId}));
            element.attr('title', username);
            if ('avatar' in attrs) {
              element.addClass('user user--avatar');
              element.html('<img src="'+avatar+'"/><span>'+username+'</span>');
            } else {
              element.addClass('user');
              element.text(username);
            }

            element.on('click', function(e) {
              $state.go('home.userDetail', {id: user.resourceId});
              e.preventDefault();
            });
          }
        }, true);
      }
    };
  });