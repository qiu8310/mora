angular.module('moraApp')
.controller('PodcastDetailCtrl', function($scope, $http, $, _, $stateParams, $modal, NodeData) {
  function getEpisodeList() {
    $http.get('api/podcasts/' + $scope.podcast.id + '/episodes').success(function(data) {
      $scope.episodes = data.episodes;
      $scope.pager.total = data.total;
    });
  }

  $http.get('api/podcasts/' + $stateParams.id).success(function(data) {
    data.attachedImg = data.backgroundImage;
    $scope.podcast = data;
    getEpisodeList();
  });

  $scope.$watch('pager.page', _.ignoreFirstCall(getEpisodeList));

  $scope.nodes = _.select(NodeData, function(node) {
    // 名师高徒，多语世界，English Only
    return [1, 5, 8].indexOf(node.id) >= 0;
  });

  $scope.newEpisode = function (podcast) {
    return $modal.open({
      templateUrl: 'views/incs/modal-episode-editor.html',
      controller: 'EpisodeEditorCtrl',
      backdrop: 'static',
      windowClass: 'episode-editor-modal',
      resolve: {
        PodcastData: function() { return _.cloneDeep(podcast); }
      }
    }).result.then(function(data) {
      $scope.episodes.push(data);
      return data;
    });
  };

  function filterEpisodes(episode) {
    $scope.episodes = _.filter($scope.episodes, function(r) {
      return r.id !== episode.id;
    });
  }

  $scope.remove = function(episode) {
    $http.delete('api/podcasts/' + $scope.podcast.id + '/episodes/' + episode.id).success(function() {
      filterEpisodes(episode);
    });
  };

  $scope.buildEpisodesFromTopics = function (podcast) {
    return $modal.open({
      templateUrl: 'views/incs/modal-episodes-from-topics.html',
      controller: 'EpisodesFromTopicsCtrl',
      backdrop: 'static',
      windowClass: 'episodes-from-topics-modal',
      resolve: {
        PodcastData: function() { return _.cloneDeep(podcast); }
      },
      size: 'lg'
    }).result.then(function(data) {
      $scope.episodes = $scope.episodes.concat(data.episodes);
      return data;
    });
  };

});
