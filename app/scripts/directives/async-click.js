/*

 <button class="btn btn-success"
   async-click="async($event, search)"
   async-target=".team-list"
   async-text="Async..."
   async-class="disabled">Async Button</button>

 */


angular.module('moraApp')
  .directive('asyncClick', function ($parse) {

    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        //var clickHandler = $parse(attrs.asyncClick);
        //
        //element.on('click', function(event) {
        //  attrs = attrs || {};
        //  attrs.asyncConfirm = element.attr('async-confirm');
        //  _.asyncClickOn(element, function() {
        //    return clickHandler(scope, {$event: event});
        //  }, attrs);
        //
        //});
      }
    };
  });