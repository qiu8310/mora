angular.module('moraApp')
  .directive('prizeBox', function() {
    return {
      replace: true,
      template: '<div><div class="bg"><i class="back"></i><i class="decorate"></i>' +
      '<i class="eyes-pink eyes"></i><i class="eyes-white eyes"></i></div>' +
      '<i class="gift"></i><i class="star star-a"></i><i class="star star-b"></i></div>'
    };
  });