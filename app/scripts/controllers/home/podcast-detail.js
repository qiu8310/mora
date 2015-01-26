angular.module('moraApp')
.controller('PodcastDetailCtrl', function($scope, $http, $, _, $stateParams, $modal, NodeData) {

  function filterEpisodes(episode) {
    $scope.Episode.episodes = _.filter($scope.Episode.episodes, function(r) {
      return r.id !== episode.id;
    });
  }

  $scope.remove = function(episode) {
    $http.delete('api/episode/' + episode.id).success(function() {
      filterEpisodes(episode);
    });
  };

  $http.get('api/podcasts/' + $stateParams.id).success(function(data) {
    data.attachedImg = data.backgroundImage;
    $scope.podcast = data;
  });
  $scope.$watch('pager.page', _.ignoreFirstCall(getEpisodeList));

  $scope.nodes = _.select(NodeData, function(node) {
    // 名师高徒，多语世界，English Only
    return [1, 5, 8].indexOf(node.id) >= 0;
  });

  function getEpisodeList() {
    var query = $.param(_.assign({type: $scope.Episode.type, 'topic_id': $scope.podcast.id}, $scope.pager));
    $http.get('api/episode/?' + query).success(function(data) {
      $scope.episodes = data.episodes;
      $scope.pager.total = data.total;
    });
  }

  $scope.newEpisode = function (podcast, nodes) {
    var isNew = !podcast;
    return $modal.open({
      templateUrl: 'views/incs/modal-podcast-editor.html',
      controller: 'PodcastEditorCtrl',
      backdrop: 'static',
      windowClass: 'podcast-editor-modal',
      resolve: {
        PodcastData: function() { return _.cloneDeep(podcast); },
        Nodes: function() { return nodes; }
      }
    }).result.then(function(data) {
      _.assign(podcast, data);
      return data;
    });
  };

});
