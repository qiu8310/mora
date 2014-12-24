angular.module('moraApp')
  .directive('loading', function($rootScope, $, $timeout, $state) {
    return {
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        var target, effect,
          destroyForStart, destroyForEnd, destroyForError,
          animateForStart, animateForEnd,
          animateLength = 500;

        // 各种效果对, 从 RootCtrl 继承过来的
        var effectPairs = scope.effectPairs;

        target = $(attrs.forSelector);
        target.addClass('speed-5');
        element.prepend('<div class="loader"><i class="fa fa-gear fa-4x fa-spin"></i></div>');


        function clearOldEffect() {
          if (effect) {
            target.removeClass('animated ' + effect.join(' '));
            effect = null;
          }
        }


        var isStateGo = false;

        animateForStart = function(e, to, toParams, from, fromParams) {
          //console.log('start to: ' + to.name);
          // 跳转到其它页面，直接退出
          if (to.name.indexOf('home') !== 0) {
            return false;
          }

          if (isStateGo === true) {
            isStateGo = false;
            return true;
          }

          clearOldEffect();

          if (effectPairs.length !== 0) {

            e.preventDefault();
            effect = _.sample(effectPairs);
            target.addClass('animated ' + effect[1]);

            $timeout(function() {
              element.addClass('active');
              isStateGo = true;

              $state.go(to.name, toParams, {location: true});
            }, animateLength);

          } else {
            element.addClass('active');
            target.hide();
          }
        };


        animateForEnd = function() {
          element.removeClass('active');

          if (effect) {
            target.removeClass(effect[1]).addClass(effect[0]);

            $timeout(function () {
              clearOldEffect();
            }, animateLength);
          } else {
            target.show();
          }
        };

        //destroyForStart = $rootScope.$on('$stateChangeStart', animateForStart);
        //destroyForError = $rootScope.$on('$stateChangeError', animateForEnd);
        //destroyForEnd = $rootScope.$on('$viewContentLoaded', animateForEnd);
        //
        //element.on('$destroy', function() {
        //  destroyForStart();
        //  destroyForEnd();
        //  destroyForError();
        //});
      }
    };

  });