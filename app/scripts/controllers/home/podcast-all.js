angular.module('moraApp')
  .controller('PodcastAllCtrl', function($scope, $http, $, _, $modal, C, NodeData) {
    $scope.list = [];

    function getList() {
      return $http.get('api/podcasts')
        .success(function(data) {
          $scope.pager.total = data.total;
          $scope.list = _.map(data.podcasts, function(podcast) {
            podcast.backgroundImage = podcast.backgroundImage || C.res.defaultAvatar;
            return podcast;
          });
        });
    }

    $scope.$watch('pager.page', _.ignoreFirstCall(getList));
    getList();

    $scope.nodes = _.select(NodeData, function(node) {
      // 名师高徒，多语世界，English Only
      return [1, 5, 8].indexOf(node.id) >= 0;
    });

    // 删除指定的播客
    $scope.dismiss = function(podcast) {
      return $http.delete('api/podcasts/' + podcast.resourceId).success(function() {
        var index = _.findIndex($scope.list, function(item) { return item.resourceId === podcast.resourceId; });
        if (index !== -1) {
          $scope.list.splice(index, 1);
        }
      });
    };

    // 将指定的小组 设置或取消 热门
    $scope.hot = function(podcast) {
      var base = podcast.isHot ? '/calm_down' : '/hot';
      return $http.put('api/podcasts/' + podcast.id + base).success(function() {
        podcast.isHot = !podcast.isHot;
      });
    };

  });
