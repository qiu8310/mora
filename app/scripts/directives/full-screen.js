angular.module('moraApp')
  .directive('fullScreen', function(_, $) {
    return {
      restrict: 'A',
      link: function(scope, element) {

        element.on('click', function(){

          var doc = document,
            docEl = doc.documentElement,
            $body = $(doc.body),
            fullScreenClass = 'full-screen';

          element.toggleClass('active');
          if ($body.hasClass(fullScreenClass)) {

            _.each([
              'exitFullscreen',
              'msExitFullscreen',
              'webkitExitFullscreen',
              'mozCancelFullScreen'], function(key) {

              if (doc[key]) {
                doc[key]();
              }
            });

          } else {

            _.each([
              'requestFullscreen',
              'msRequestFullscreen',
              'webkitRequestFullscreen',
              'mozRequestFullScreen'], function(key) {

              if (docEl[key]) {
                docEl[key]();
              }

            });

          }

          $body.toggleClass(fullScreenClass);

        });
      }
    };
  });