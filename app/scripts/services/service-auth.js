angular.module('moraApp')
  .service('Auth', function Auth(Storage) {

    var _token;

    this.setToken = function(token) {
      _token = token;
      Storage.set('token', token);
      return token;
    };


    this.getToken = function() {
      return _token || Storage.get('token');
    };

  });
