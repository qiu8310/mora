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

            var username = user.name || user.userName || '',
              id = user.id || user.resourceId || user.userId,
              avatar = user.avatar || user.imageUrl || user.userAvatar || C.res.defaultAvatar;

            avatar = avatar + '?imageView2/5/w/100/h/100';
            element.attr('href', $state.href('home.userDetail', {id: id}));
            element.attr('title', username);
            if ('avatar' in attrs) {
              element.addClass('user user--avatar');
              element.html('<img src="'+avatar+'"/><span>'+username+'</span>');
            } else if ('avatarOnly' in attrs) {
              element.addClass('user user--avatar user--avatar--only');
              element.html('<img src="'+avatar+'"/>');
            } else {
              element.addClass('user');
              element.text(username);
            }

            element.on('click', function(e) {
              $state.go('home.userDetail', {id: id});
              e.preventDefault();
            });
          }
        }, true);
      }
    };
  });