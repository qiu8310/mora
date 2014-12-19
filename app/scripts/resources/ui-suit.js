angular.module('moraApp')
  .directive('post', function() {
    return {
      restrict: 'A',
      scope: {post: '='},
      link: function postLink(scope, element, attrs) {
        var html = [],
          post = scope.post, audio, content, pic;

        if (post) {
          audio = post.audioUrl;
          content = post.body;
          pic = post.attachedImg;

          if (audio) {
            html.push('<audio class="post-detail__audio" controls src="'+audio+'"></audio>');
          }
          if (content) {
            content = content.replace(/[\r\n]+/g, '<br/>').replace(' ', '&nbsp;');
            html.push('<p class="post-detail__text">'+content+'</p>');
          }
          if (pic) {
            html.push('<img class="post-detail__img" src="'+pic+'"/>');
          }

          element.html('<div class="post-detail">' + html.join('') + '</div>');
        }

        scope.$watch('post.body', function(body) {
          if (typeof body !== 'undefined') {
            element.find('.post-detail__text').text(body);
          }
        })

      }
    };
  });