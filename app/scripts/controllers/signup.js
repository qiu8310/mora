'use strict';

angular.module('moraApp')
  .controller('SignupCtrl', function ($scope, $http, md5) {
    $scope.user = {
      email: 'qiuzhongleiabc@126.com',
      nickname: 'Mora',
      password: 'qiu8310',
      passwordCheck: 'qiu8310'
    };



    $scope.submit = function() {
      $http.post('api/user', {
        email: $scope.user.email,
        nickname: $scope.user.nickname,
        password: md5.createHash($scope.user.password)
      });
    };
  });
