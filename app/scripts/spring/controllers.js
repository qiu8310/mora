
angular.module('moraApp')

  .controller('SpringHomeCtrl', function($scope, $location) {

    $scope.prizes = []; // 所有奖品
    $scope.showNoPrizeTip = false;


    // 开始游戏
    $scope.goToGame = function() {
      $location.path('/spring/game');
    };


    // 去到个人礼物主页（没有礼物要先提醒用户）
    $scope.goToMyPrizes = function() {
      if ($scope.prizes.length) {
        $location.path('/spring/prizes');
      } else {
        $scope.showNoPrizeTip = true;
      }
    };

    // 关闭”没有礼物的提醒“
    $scope.closeNoPrizeTip = function() {
      $scope.showNoPrizeTip = false;
    };

  })

  .controller('SpringGameCtrl', function($scope, $timeout, $location) {

    $scope.pickEnable = false;

    $timeout(function() {
      $scope.pickEnable = true;
    }, 400);


    $scope.pick = function(e) {
      if (!$scope.pickEnable) {
        return false;
      }
      $scope.pickEnable = false;

      var el = ng.element(e.target.parentNode);

      el.addClass('flip prize-no');

      $timeout(function() {
        $location.path('/spring/game-success');
      }, 500);
    };

  })

  .controller('SpringGameSuccessCtrl', function($scope) {
    $scope.showShareTip = false;


  })
  .controller('SpringGameErrorCtrl', function($scope, Media) {


    var player = Media.setupAudioPlayers('.audio')[0];
    player.on('playing pause ended', function(e) {
      if (e.type === 'playing') {
        console.log('playing');
      } else {
        console.log('not playing');
      }
    });

    $scope.$on('$routeChangeStart', function() {
      player.destroy();
    });


  });