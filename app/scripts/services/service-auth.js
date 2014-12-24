angular.module('cheApp')
  .service('Auth', function Auth(Storage) {

    var _token;

    this.setToken = function(token) {
      _token = token;
      return Storage.set('token', token);
    };

    this.hasToken = function() {
      return !! this.getToken();
    };

    this.getToken = function() {
      return _token || Storage.get('token');
    };

    this.clearToken = function() {
      _token = null;
      Storage.del('token');
    };

  });
