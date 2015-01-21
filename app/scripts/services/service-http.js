angular.module('mora.ui')
  .service('http', function($http) {
    var http = this,
      rReplace = /:([-\w]+)/g,
      rTest = /:([-\w]+)/;

    this.http = $http;

    function parseUrl(url, params) {
      return url.replace(rReplace, function(raw, key) {
        return params && (key in params) ? params[key] : raw;
      });
    }

    ng.forEach(['get', 'head', 'delete', 'jsonp', 'post', 'put'], function(key){
      http[key] = function(url, params, args) {
        var index = 1;
        if (rTest.test(url)) {
          url = parseUrl(url, params);
          index = 2;
        }
        args = [].slice.call(arguments, index);
        return $http[key].apply($http, [url].concat(args));
      };
    });
  });