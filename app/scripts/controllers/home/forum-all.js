angular.module('moraApp')
  .controller('ForumSearchCtrl', function($scope, C, $http) {
    function getList() {
      return $http.get('api/forum/search/?' + $scope.search.params().toQuery())
        .success(function(data) {
          $scope.pager.total = data.total;
          $scope.list = _.map(data.topics || data, function(thread) {
            if (thread.audioUrl) {
              thread.audioUrl += C.res.audioPrefix;
            }
            return thread;
          });
        });
    }


    $scope.$watch('pager.page', _.ignoreFirstCall(getList));

    $scope.filters = [
      {
        key: 'type',
        active: 'visible',
        list: [
          {all: '所有删除和未删除的贴子'},
          {visible: '未删除的贴子'},
          {deleted: '删除的贴子'}
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
  })
  .controller('ForumAllCtrl', function($scope, $http, _, C, NodeData) {

    /*
     essence_ops_forum_node GET    /ops/forum_nodes/:id/essence(.:format)    ops/forum_nodes#essence
     recommend_ops_forum_node GET    /ops/forum_nodes/:id/recommend(.:format)  ops/forum_nodes#recommend
     ops_forum_nodes GET    /ops/forum_nodes(.:format)                ops/forum_nodes#index
     ops_forum_node GET    /ops/forum_nodes/:id(.:format)            ops/forum_nodes#sho
     */

    function getList() {
      var params;
      params = $scope.search.params();

      var category = params.filters.category, node = params.filters.node,
        api;

      if (node !== 'all'){
        api = 'api/node/' + node + '/';
        if (_.include(['essence', 'recommend'], category)) {
          api += category;
        }
      } else {
        api = 'api/forum/';
      }
      api += '?' + params.toQuery();

      return $http.get(api)
        .success(function(data) {
          $scope.pager.total = data.total;
          $scope.list = _.map(data.topics || data, function(thread) {
            if (thread.audioUrl) {
              thread.audioUrl += C.res.audioPrefix;
            }
            return thread;
          });
        });
    }

    $scope.$watch('pager.page', _.ignoreFirstCall(getList));
    $scope.$on('search:init:finished', function() {
      $scope.$watch('filters', getList, true);
    });


    $scope.filters = [
      {
        key: 'node',
        active: 'all',
        list: [{
          all: '所有版块的帖子'
        }].concat(_.map(NodeData, function(node) {
            var obj = {};
            obj[node.id] = node.name;
            return obj;
          }))
      },
      {
        key: 'category',
        active: 'all',
        list: [
          {all: '所有类型帖子'},
          {essence: '精华帖子'},
          {recommend: '推荐帖子'}
        ]
      },
      {
        key: 'type',
        active: 'visible',
        list: [
          {all: '所有删除和未删除的贴子'},
          {visible: '未删除的贴子'},
          {deleted: '删除的贴子'}
        ]
      }
    ];

    $scope.search = {
      hide: true
    };


  });