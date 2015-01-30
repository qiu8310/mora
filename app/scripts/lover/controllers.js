angular.module('moraApp')
  .controller('LoverLetterCtrl', function() {

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


      var m = new Asset.Manager();
      if (!$templateCache.get(tpl)) { m.add('http', tplPath); }
      m.add('image', images);

      m.downloadAll(function() {
        loaded = true;
        var tplItem = this.get('http', tplPath);
        if (tplItem && tplItem.status === 'success') { $templateCache.put(tpl, tplItem.data); }
        setTimeout(cb, 600);
      });
    }

  });