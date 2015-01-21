angular.module('mora.ui')
  .factory('Dialog', function(Env) {

    var win = Env.win;

    return {
      alert: function(msg) {
        if(Env.isLocal) {
          console.error('Dialog.alert: ' + msg);
        } else {
          win.alert(msg);
        }
      },
      confirm:  function(msg) { return win.confirm(msg); },
      prompt:   function(msg, defaultValue) { return win.prompt(msg, defaultValue); }
    };
  });