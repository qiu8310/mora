angular.module('moraApp')
  .factory('UserSer', function($http) {
    return {
      detail: function(id) {
        return $http.get('api/users/' + id).then(function(data) { return data.data; });
      },
      forbid: function(id) {
        return $http.put('api/users/' + id + '/block').then(function(data) { return data.data; });
      }
    };
  })

  .factory('ForumSer', function($http) {
    return {
      thread: function(id) {
        return $http.get('api/forum/' + id).then(function(data) {
          return data.data;
        });
      },
      nodes: function() {
        return $http.get('api/node/').then(function(data) {
          return data.data;
        });
      }
    };

  });