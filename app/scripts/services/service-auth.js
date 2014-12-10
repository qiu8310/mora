angular.module('moraApp')
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



    this.setLoginUser = function(user) {
      if (!user.username && user.email) {
        user.username = user.email.split('@').shift();
      }
      Storage.set('loginUser', user.rememberMe ?
        user : {email: user.email, username: user.username});
    };


    this.getLoginUser = function(needPassword) {
      var user = Storage.get('loginUser', {});
      if (!needPassword) {
        delete user.password;
      }
      return user;
    };

  });
