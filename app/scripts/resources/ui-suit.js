angular.module('moraApp')
  .directive('dateFormat', function($filter, $parse) {
    return {
      require: 'ngModel',
      restrict: 'A',
      scope: true,
      link: function(scope, element, attrs, modelCtrl) {
        var target = attrs.ngModel.replace(/Format$/, ''),
          targetGetter = $parse(target),
          targetSetter = targetGetter.assign,
          viewerSetter = $parse(attrs.ngModel).assign;


        var setOutputValue = function(inputValue) {
          viewerSetter(scope, $filter('date')(inputValue, attrs.dateFormat || 'yyyy/MM/dd HH:mm:ss'));
        };

        // 初始化 modelCtrl 的值
        setOutputValue(targetGetter(scope));

        scope.$watch(attrs.ngModel, function(val) {
          if (!val) { return false; }
          var date = new Date(val);
          if (date.toString() === 'Invalid Date') {
            return false;
          }
          targetSetter(scope, date);
        });

      }
    };
  })
  .directive('mBlank', function(C, $location) {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        if (C.app.html5Mode) {
          element.attr('target', '_blank');
        } else {
          element.on('click', function(e) {
            var hash = '#' + (C.app.hashPrefix || '') + element.attr('href');
            window.open($location.$$absUrl.replace(/#.*$/, '') + hash);
            e.preventDefault();
          });
        }
      }
    };
  })

  .directive('bannerCard', function() {
    return {
      restrict: 'E',
      replace: true,
      scope: {
        data: '=', // banner = {data: '', type: ''}
        banner: '=',
        type: '='
      },
      templateUrl: 'views/tpls/banner-card.html',
      controller: function($scope, C, Env) {
        $scope.TYPE = C.constants.BANNER_TYPE;
        $scope.cmsBaseUrl = Env.isTest ? 'http://cms-staging.liulishuo.com/' : 'http://cms.liulishuo.com/';
      }
    };
  })


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
        });

      }
    };
  });