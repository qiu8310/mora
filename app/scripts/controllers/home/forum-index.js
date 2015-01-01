angular.module('moraApp')
  .controller('ForumIndexCtrl', function($scope, $q, $http, $, C) {

    /**
     * GET /ops/forum_topics/home 所有的主页帖子
     * POST /ops/forum_topics/home   id: topic_id, 设置一个帖子为主页topic
     * DELETE  /ops/forum_topics/home   id: topic_id, 取消一个主页topic
     */
    function getList() {
      return $http.get('api/forum/home?' + $.param($scope.pager))
        .success(function(data) {
          $scope.pager.total = data.total || 100;
          $scope.list = _.map(data.topics || data, function(thread) {
            if (thread.audioUrl) {
              thread.audioUrl += C.res.audioPrefix;
            }
            return thread;
          });
        });
    }
    $scope.$watch('pager.page', getList);

  });