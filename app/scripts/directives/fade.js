'use strict';

angular.module('moraApp')
  .directive('fade', function ($, $timeout) {
    return {
      restrict: 'A',

      link: function postLink(scope, element, attrs) {
        var viewHeight,
          contentHeight,
          cls = 'box-fade';

        $timeout(function() {

          element.addClass(cls);
          viewHeight = element.height();
          contentHeight = _.reduce(element.children(), function(sum, el) {
            return $(el).height() + sum;
          }, 0);

          var hideMore = contentHeight > viewHeight || element.find('img').length;

          element[hideMore ? 'addClass' : 'removeClass'](cls);
          //element.toggleClass(cls, hideMore);

          if (hideMore) {
            element.append('<a class="text-center fade-toggle">Show more</a>');
            element.find('.fade-toggle').on('click', function(e) {
              element.toggleClass(cls);
              $(e.target).text(element.hasClass(cls) ? 'Show more' : 'Show less');
            });
          }

        }, 0);



      }
    };
  });
