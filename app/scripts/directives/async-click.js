/*

 <button class="btn btn-success"
   async-click="async($event, search)"
   data-text="Async..."
   data-confirm="Are you sure?"
   data-style="disabled">Async Button</button>

 */


angular.module('mora.ui')
  .directive('asyncClick', function ($parse) {

    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        var clickHandler = $parse(attrs.asyncClick);

        element.on('click', function(event) {
          ng.asyncClick(element, function() {
            return clickHandler(scope, {$event: event});
          }, attrs);

        });
      }
    };
  });