angular.module('moraApp')
  .controller('ForumAllCtrl', function($scope, $q, $http, _, C, $modal, NodeData) {

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
        isDeleted, api;

      if (params.keyword) {
        api = 'api/forum/search/';
      } else if (node !== 'all'){
        api = 'api/node/' + node + '/';
        if (_.include(['essence', 'recommend'], category)) {
          api += category;
        }
      } else {
        if (params.filters.type === 'deleted') {
          isDeleted = true;
        }
        api = 'api/forum/';
      }
      api += '?' + params.toQuery();

      $http.get(api)
        .success(function(data) {
          $scope.search.keyword = '';
          $scope.pager.total = data.total;
          $scope.list = _.map(data.topics || data, function(thread) {
            if (isDeleted) {
              thread.isDeleted = isDeleted;
            }
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
      async: {
        target: '.thread-list'
      },
      keyword: '',
      placeholder: '搜索帖子',
      searchFn: function(e, params) {
        return getList();
      }
    };











  });