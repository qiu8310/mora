angular.module('moraApp')
  .service('Prize', function(http) {
    this.get = function(id) {
      return http.get('api/prizes?prize_id=:id', {id: id}).then(function(data) {
        return data.data.prize;
      });
    };
  });