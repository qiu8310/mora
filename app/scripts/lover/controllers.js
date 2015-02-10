angular.module('moraApp')
  .controller('LoverLetterCtrl', function(Data, Env, $scope, Native, Media) {
    var uid = parseInt(Data.id, 10);

    $scope.data = Data;

    var now = new Date(Env.G.currentTimestamp * 1000),
      createdAt = new Date(Data.createdAt * 1000),
      elapsed = Env.G.currentTimestamp - Data.createdAt;

    $scope.elapsed = elapsed;
    $scope.elapsedDays = Math.floor(elapsed/86400);
    $scope.elapsedHours = Math.floor((elapsed % 86400) / 3600);
    $scope.elapsedMinutes = Math.round(((elapsed % 86400) % 3600) / 60);
    $scope.createdAt = createdAt;

    var pages = [0, 1, 2, 3, 4];
    if (Data.findUser) {
      $scope.lowestScoreDate = new Date(Data.lowDate * 1000);

      // 去掉 第3页
      if (Data.topicsCount < 1 && Data.topicRepliesCount < 20) {
        pages.splice(2, 1);
      }
      // 学习数据不足，就去掉第2页，否则去掉第1页
      pages.splice(Data.sentenceCount < 32 ? 1 : 0, 1);

    } else {
      pages = [0, 3, 4];
    }
    $scope.swipeChildren = pages;

    var player,
      audios = [
        'http://cdn-l.llsapp.com/connett/029e3cef-f150-4a09-bf7c-60a26073ee9b',
        'http://cdn-l.llsapp.com/connett/437a3bf9-54b2-4a33-8696-97c0237fe78d'],
      play = function() { player.play(); Env.doc.removeEventListener('touchstart', play, false); },
    destroy = function() { player.destroy(); };



    Native.invoke('nativeBack', destroy);
    Native.invoke('nativeMinimize', destroy);
    $scope.$on('$routeChangeStart', destroy);


    // 这里用 ng-click 在 android 上有问题，触发不了事件
    //$scope.shareX = function() {
    //
    //};

    $scope.$evalAsync(function() {
      player = Media.setupAudioPlayers('.music', {src: [audios[Date.now() % audios.length]]})[0];
      //player = Media.AudioPlayer(audios[Date.now() % audios.length]);
      if (player) {
        if (Env.Mobile.isAny) {
          Env.doc.addEventListener('touchstart', play, false);
        } else {
          player.play();
        }
      }

      Env.doc.querySelector('.btn').addEventListener('touchstart', function() {
        var loc = Env.win.location;
        Env.ga('分享');
        if (Env.Platform.isLLS) {
          Native.share({
            url: 'http://' + loc.host + loc.pathname + '?uid=' + uid,
            content: '我收到的最感人滴情书，感觉整个情人节都暖暖的～',
            img: 'http://cdn-l.llsapp.com/connett/976bc125-74d7-459c-8d0f-f5d0e1e463ae'
          });
        } else {
          Native.getLLSApp();
        }
      }, false);
    });

  })

  .controller('LoverHomeCtrl', function($scope, Env, Asset, $templateCache) {

    $scope.start = function() {
      Env.ga('生成情书');
      $scope.loading = true;
      load(function() {
        $scope.loading = false;
        Env.path('/letter');
        $scope.$apply();
      });
    };

    var loaded = false;
    function load(cb) {
      if (loaded) { return false; }

      //loaded = true;
      //setTimeout(cb, 800);
      //var assets = Env.G.ASSETS;

      // 预先加载 letter.html 文件
      var assets = Env.G.ASSETS;
      var tpl = assets.views['letter.html'];
      var tplPath = Env.isLocal ? 'http://' + location.host + '/' + tpl : tpl;

      // 预先加载所有图片
      var images = Object.keys(assets.images).map(function(key) { return assets.images[key]; });

      var m = new Asset.Manager(), now = Env.now();
      if (!$templateCache.get(tpl)) {
        m.add('http', tplPath);
        m.add('http', 'api/userinfo' + (Env.QUERY.uid ? '?userId=' + Env.QUERY.uid : ''), {cache: true});
      }
      m.add('image', images);

      m.downloadAll(function() {
        var tplItem = this.get('http', tplPath),
          elapse = Env.now() - now;
        if (tplItem && tplItem.status === 'success') { $templateCache.put(tpl, tplItem.data); }
        setTimeout(cb, elapse > 800 ? 0 : 800 - elapse);
      });
    }

  });