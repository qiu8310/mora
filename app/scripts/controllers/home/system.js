angular.module('moraApp')
  .controller('SystemMessageCtrl', function($scope, _, $http, Dialog) {

    $scope.message = {
      type: 'system',
      platforms: {
        ios: true,
        android: true
      },
      date: new Date(),
      push: true,
      test: true
    };


    $scope.submit = function(e) {
      var m = $scope.message;
      _.asyncClickOn(angular.element(e.target).find('[type=submit]'), function() {
        return $http.post('api/notifications', {
          content: m.content,
          message_type: m.type,
          platforms: _.filter(_.keys(m.platforms), function(k) { return m.platforms[k]; }),
          schedule: Math.round(m.date.getTime() / 1000),
          push: m.push,
          event_url: m.event_url,
          event_details: m.event_details,
          event_cover_img: m.event_cover_img,
          test: m.test
        }).success(function(data) {
          //if (data.success === 'ok') {
          Dialog.alert('提交成功');
          //}
        });
      });
    };
  });
