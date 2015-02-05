/* global G */

function getPrizeColor(key) {
  // freehand_greeting_card, music_greeting_card, course
  return key === 'course' ? 'red' : key.charAt(0) === 'm' ? 'green' : 'blue';
}
function getFriendlyPrize(prize) {
  var c = getPrizeColor(prize.prize);
  if (prize.userId === G.currentUser.id) { prize.isOwned = true; }
  prize.color = c;
  prize.label = c === 'red' ? '《Jonathan在中国过新年》' : c === 'green' ? '新年电子贺卡' : '新年手绘贺卡';
}

function share(Native) {
  var loc = window.location;
  Native.share({
    img: 'http://cdn-l.llsapp.com/connett/db912c75-79b4-4db8-a1a7-0b79b7a331d8',
    content: '英语流利说新年礼包到了，有什么好东东，快来帮我拆开',
    url: 'http://' + loc.host + loc.pathname,
    channels: ['wx_timeline', 'wx_friend']
  });
}


angular.module('moraApp')

  .controller('SpringHomeCtrl', function($scope, Env, http, Native) {

    $scope.showNoPrizeTip = false;

    if (!Env.Platform.isLLS) { Native.getLLSApp(); }


    // 去到个人礼物主页（没有礼物要先提醒用户）
    $scope.goToMyPrizes = function() {
      return http.get('api/lottery').success(function(data) {
        if (data.prizes.length) {
          Env.path('/prizes');
        } else {
          $scope.showNoPrizeTip = true;
        }
      });
    };


    // 关闭”没有礼物的提醒“
    $scope.closeNoPrizeTip = function() {
      $scope.showNoPrizeTip = false;
    };
  })
  .controller('SpringInfoCtrl', function($scope, http) {
    $scope.fetch = function() {
      if ($scope.input) {
        return http.post('api/prizes?ignoreError=yes', {'prize_code': $scope.input})
          .success(function() { window.alert('领取成功！'); })
          .error(function() { $scope.showTip = true; });
      }
    };
    $scope.showTip = false;
  })
  .controller('SpringGameCtrl', function($scope, $timeout, http, Env, Native) {

    if (!Env.Platform.isLLS) { Native.getLLSApp(); }

    $scope.pickEnable = false;

    $timeout(function() {
      $scope.pickEnable = true;
    }, 4000);

    // 126 [10] 262 [10] 147 => 555
    var win = Env.win, doc = win.document, h = 126 + 147, scale,
      winH = doc.documentElement.clientHeight;

    if (winH < 555) {
      scale = (555 - winH) / h;
      $timeout(function() {
        ng.css3(doc.querySelector('.container'), 'height', '555px');
        win.scrollTo(0, scale * 126);
      }, 100);
    }
    win.scrollTo(0, 1);


    function goTo(status, id) {
      $timeout(function() {
        Env.path('/game-' + status + (id ? '/' + id : ''));
      }, 1000);
    }

    $scope.pick = function(e) {
      if (!$scope.pickEnable) {
        return false;
      }
      $scope.pickEnable = false;

      var el = ng.element(e.target.parentNode);

      function goToError() {
        el.addClass('flip prize-no');
        goTo('error');
      }

      if (!Env.isLocal && Math.round(Math.random() * 100) % 2) {
        goToError();
        goTo('error');
        return false;
      }

      return http.post('api/lottery?ignoreError=yes')
        .success(function(data) {
          var key = getPrizeColor(data.prize.prize);
          el.addClass('flip prize-' + key);
          goTo('success', data.prize.id);
        })
        .error(goToError);

    };

  })
  .controller('SpringGameSuccessCtrl', function(prize, $scope, Env, Native) {
    getFriendlyPrize(prize);

    if (!prize.isOwned) {
      Env.path('/prize/' + prize.id);
      return false;
    }

    $scope.share = function() { share(Native); };

    $scope.prize = prize;

  })
  .controller('SpringGameErrorCtrl', function($scope, Media, Env) {
    var ai, player,
      audios = [
        'http://liulishuo-dream.qiniudn.com/happy2015.mp3',
        'http://liulishuo-dream.qiniudn.com/happynewyear.mp3'
      ];
    for (ai = 1; ai <= 20; ai++) { audios.push('http://liulishuo-dream.qiniudn.com/' + ai + '.mp3'); }

    $scope.audio = ng.random(audios);

    Env.win.setTimeout(function() { player = Media.setupAudioPlayers('.audio')[0]; }, 200);

    $scope.$on('$routeChangeStart', function() { player.destroy(); });
  })
  .controller('SpringPrizeCtrl', function($scope, Env, prize, http, Native) {

    getFriendlyPrize(prize);
    $scope.prize = prize;
    $scope.opened = prize.unlock;
    $scope.untouched =  prize.touchUsersTotal === 0;
    $scope.touchUsersCount = prize.touchUsersTotal;

    /* jshint ignore:start */
    $scope.isOwned = prize.userId == Env.G.currentUser.id;
    /* jshint ignore:end */
    $scope.helped = prize.isTouch;
    $scope.owner = prize.nickname;

    $scope.showTip = function() { share(Native); };
    //$scope.showTip = function() { $scope.showShareTip = true; };
    //$scope.closeTip = function() { $scope.showShareTip = false; };
    $scope.helpOpen = function() { Env.path('/prize/open/' + prize.id); };

    $scope.input = prize.username || prize.mobile;
    $scope.inputDisabled = !!$scope.input;
    $scope.open = function() {
      if (!$scope.input) { return false; }
      var next = function() {
        if (prize.username) {
          Env.path('/card/' + prize.id);
        } else if (prize.mobile) {
          Env.path('/course/' + prize.id);
        }
      };

      if (!prize.username && !prize.mobile) {
        var params = {'prize_id': prize.id},
          key = prize.prize === 'course' ? 'mobile' : 'username', val = $scope.input;
        params[key] = val;
        prize[key] = val;
        http.put('api/prizes', params).success(next);
      } else {
        next();
      }
    };
  })
  .controller('SpringPrizeOpenCtrl', function($routeParams, http) {
    http.post('api/prize_tickets?ignoreError=yes', {'prize_id': $routeParams.id});
  })
  .controller('SpringCourseCtrl', function($scope, prize, http, Native) {
    getFriendlyPrize(prize);
    $scope.prize = prize;

    $scope.learn = function() {
      Native.addModule('54bf7ba8636d7304adec0100');
    };

    http.post('api/prizes?ignoreError=yes', {'prize_code': prize.prizeCode})
      .success(function() { window.alert('领取成功！'); });
      //.error(function() { window.alert('课程领取失败！'); });

    //$scope.claim = function() {
    //  Env.path('info');
    //};
    //$scope.downloadUrl = Env.downloadUrl;
  })
  .controller('SpringCardCtrl', function($scope, prize, Media, Env) {
    var texts = [], allTexts = [
      '2015还要一起走！',
      '很高兴遇见你。',
      '不是瘦就是死！',
      '上帝偷偷告诉我，2015你会走运哟！',
      '祝你天天萌萌哒。',
      '远离挂科，珍爱生命！',
      '2015让我们且行其珍惜。',
      '2015你一定会脱单！',
      '2015月薪过万不是梦！',
      '来一场说走就走的旅行？',
      '牵牵手做一对可爱的吃货。',
      '2015，找个时间约一约！',
      '土豪求包养',
      '新年桃花朵朵开呀！',
      '让我们挥别2014，迎接2015。',
      '许久不联系，現在的你好吗？',
      '新的一年小心别感冒哦！',
      '说好的红包呢？',
      '2015做个安静的美男子吧',
      '那么问题来了，什么时候请我吃饭呢？'
    ];

    var player, play, ai,
      audios = [];
    for (ai = 111; ai <= 130; ai++) {
      audios.push('http://liulishuo-dream.qiniudn.com/' + ai + '.mp3');
    }

    // 根据 prize.id 从 allTexts 中选出固定的 5 段文本
    var len = allTexts.length, id = prize.id, i;
    for (i = 1; i <= 5; i++) { texts.push(allTexts[id * i % len]);}

    if (prize.prize === 'music_greeting_card') {
      player = Media.AudioPlayer(audios[id % audios.length]);
      play = function() { player.play(); Env.doc.removeEventListener('touchstart', play, false); };
      if (Env.Mobile.isAny) {
        Env.doc.addEventListener('touchstart', play, false);
      } else {
        play();
      }
      player.on('ended', function() { player.play(); });
      $scope.$on('$routeChangeStart', function() { player.destroy(); });
    }

    $scope.username = prize.username;
    $scope.texts = texts;

  })
  .controller('SpringPrizesCtrl', function($scope, http, Env) {

    $scope.closed = [];
    $scope.opened = [];

    $scope.goToPrize = function(prize) {
      Env.path('/prize/' + prize.id);
    };

    http.get('api/lottery').success(function(data) {
      var prizes = data.prizes;
      prizes.sort(function(a, b) { return b.touchUsersTotal - a.touchUsersTotal; });

      var allClosed = [];
      prizes.forEach(function(prize) {
        getFriendlyPrize(prize);
        if (prize.unlock) {
          $scope.opened.push(prize);
        } else {
          allClosed.push(prize);
        }
      });

      $scope.closedLength = allClosed.length;
      $scope.openedLength = $scope.opened.length;
      allClosed = allClosed.slice(0, 9);

      // 分成三个一组
      var index = 0, ref;
      while (allClosed.length) {
        if (index % 3) {
          ref = $scope.closed[$scope.closed.length - 1];
        } else {
          ref = [];
          $scope.closed.push(ref);
        }
        ref.push(allClosed.shift());
        index++;
      }
    });

  });
