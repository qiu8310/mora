angular.module('moraApp')
  .factory('Dialog', function($window) {

    return {
      alert:    function(msg) { $window.alert(msg); },
      confirm:  function(msg) { $window.confirm(msg); },
      prompt:   function(msg, defaultValue) { $window.prompt(msg, defaultValue); }
    };
  });