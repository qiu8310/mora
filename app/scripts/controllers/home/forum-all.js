angular.module('moraApp')
  .controller('ForumAllCtrl', function($scope, $q, $http, $, _, Dialog, C) {

    /*
     hot_ops_forum_topics GET         /ops/forum_topics/hot(.:format)           ops/forum_topics#hot
     make_hot_ops_forum_topic PUT     /ops/forum_topics/:id/make_hot(.:format)  ops/forum_topics#make_hot
     calm_down_ops_forum_topic PUT    /ops/forum_topics/:id/calm_down(.:format) ops/forum_topics#calm_down
     ops_forum_topics GET             /ops/forum_topics(.:format)               ops/forum_topics#index
     ops_forum_topic GET              /ops/forum_topics/:id(.:format)           ops/forum_topics#show
     DELETE /ops/forum_topics/:id(.:format)           ops/forum_topics#destroy
     */

    function getList() {
      var query, params;
      params = $scope.search.params();
      query = $.param(
        params.keyword ?
        {query: params.keyword} :
        _.assign({}, params.classify, params.filters, $scope.pager || {})
      );

      var isHot = params.filters.hot === 'yes';
      var api = 'api/forum/' + (params.keyword ? 'search'  : (isHot ? 'hot' : '')) + '?' + query;
      return $http.get(api)
        .success(function(data) {
          $scope.pager.total = data.total;
          $scope.list = _.map(data.topics || data, function(thread) {
            thread.isHot = isHot;
            if (thread.audioUrl) {
              thread.audioUrl += C.res.audioPrefix;
            }
            return thread;
          });
        });
    }


    $scope.$watch('pager.page', _.ignoreFirstCall(getList));
    $scope.$on('search:init:finished', getList);



    $scope.filters = [
      {
        key: 'hot',
        active: 'all',
        list: [
          {all: '所有帖子'},
          {yes: '热门帖子'}
        ]
      }
    ];

    $scope.search = {
      async: {
        target: '.thread-list'
      },
      keyword: '',
      placeholder: '搜索帖子',
      searchFn: function(e, params) {
        return getList();
      }
    };

    $scope.hot = function(thread) {
      var api = thread.isHot ? 'calm_down' : 'make_hot';
      return $http.put('api/forum/' + thread.id + '/' + api).success(function() {
        thread.isHot = !thread.isHot;
      });
    };

    $scope.del = function(thread, index) {
      return $http.delete('api/forum/' + thread.id).success(function() {
        $scope.list.splice(index, 1);
      });
    };

  });