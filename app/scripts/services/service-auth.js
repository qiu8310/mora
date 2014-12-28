angular.module('cheApp')
  .service('Auth', function Auth(Storage) {

    var AUTH_KEY = 'sjk-t';

    this.set = function(data) {
      return Storage.set(AUTH_KEY, data, true);
    };

    this.has = function(key) {
      return !!this.get(key);
    };

    this.get = function(key) {
      var auth = Storage.get(AUTH_KEY);
      return ng.isUndefined(key) ? auth : (auth && (key in auth)) ? auth[key] : null;
    };

    this.clear = function() {
      return Storage.del(AUTH_KEY);
    };

  });
