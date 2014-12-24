angular.module('moraApp')
  .factory('Dialog', function($window, Env) {

    return {
      alert: function(msg) {
        if(Env.isLocal) {
          console.error(msg);
        } else {
          $window.alert(msg);
        }
      },
      confirm:  function(msg) { return $window.confirm(msg); },
      prompt:   function(msg, defaultValue) { return $window.prompt(msg, defaultValue); }
    };
  });