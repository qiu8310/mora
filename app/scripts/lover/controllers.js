angular.module('moraApp')
  .controller('LoverLetterCtrl', function(Data, Env, $scope, Native) {
    var uid = Data.id;

    $scope.data = Data;

    var now = new Date(Env.G.currentTimestamp * 1000),
      createdAt = new Date(Data.createdAt * 1000),
      elapsed = Env.G.currentTimestamp - Data.createdAt;

    $scope.elapsedDays = Math.floor(elapsed/86400);
    $scope.elapsedHours = Math.round((elapsed % 86400) / 3600);
    $scope.createdAt = createdAt;

    $scope.pageNumber = Data.findUser ? 0 : 1;

    if (Data.findUser) {
      $scope.lowestScoreDate = new Date(Data.lowDate * 1000);
    }

    $scope.share = function() {
      var loc = Env.win.location;

      if (Env.Platform.isLLS) {
        Native.share({
          url: 'http://' + loc.host + loc.pathname + '?uid=' + uid,
          content: '我收到的最感人滴情书，感觉整个情人节都暖暖的～'
        });
      } else {
        Native.getLLSApp();
      }

    };

  })

  .controller('LoverHomeCtrl', function($scope, Env, Asset, $templateCache) {

    $scope.start = function() {
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

      var assets = Env.G.ASSETS;

      // 预先加载 letter.html 文件
      var tpl = assets.views['letter.html'];
      var tplPath = Env.isLocal ? 'http://' + location.host + '/' + tpl : tpl;

      // 预先加载所有图片
      var images = Object.keys(assets.images).map(function(key) { return assets.images[key]; });


      var m = new Asset.Manager(), now = Env.now();
      if (!$templateCache.get(tpl)) {
        m.add('http', tplPath);
        m.add('http', 'api/userinfo', {cache: true});
      }
      m.add('image', images);


      m.downloadAll(function() {
        loaded = true;
        var tplItem = this.get('http', tplPath), elapse = Env.now() - now;
        if (tplItem && tplItem.status === 'success') { $templateCache.put(tpl, tplItem.data); }
        setTimeout(cb, elapse > 800 ? 0 : 800 - elapse);
      });
    }

  });