angular.module('moraApp')
  .controller('TeamTagsCtrl', function($scope, $http, C, Dialog, _, $) {

    var defaultCategory = C.team.defaultCategory;
    $scope.list = [];

    function getList() {
      var params = $scope.search.params();
      var query = $.param(_.assign({}, params.classify, params.filters, $scope.pager || {}));

      var isHot = params.filters.hot === 'yes';
      return $http.get('api/' + (isHot ? 'hot_tags' : 'tags') + '?' + query).success(function(data) {
        $scope.list = _.map(data.tags, function(tag) {
          return {name: tag, isHot: isHot};
        });
      });
    }

    $scope.filters = [
      {
        key: 'hot',
        active: 'all',
        list: [
          {all: '所有标签'},
          {yes: '热门标签'}
        ]
      },
      {
        key: 'category',
        active: defaultCategory,
        list: _.cloneDeep(C.team.categories)
      }
    ];


    $scope.search = {
      async: {
        target: '.tag-list'
      },
      keyword: '',
      placeholder: '搜索标签',
      searchFn: function(e, params) {
        if (params.keyword) {
          Dialog.alert('暂不支持关键字搜索');
          $scope.search.keyword = '';
        }
        return getList();
      }
    };



    $scope.hot = function(tag) {
      return $http.put('api/' + (tag.isHot ? 'calm_down' : 'hot') + '_tag?tag=' + tag.name).success(function() {
        tag.isHot = !tag.isHot;
      });
    };


    $scope.$watch('pager.page', _.ignoreFirstCall(getList));
    $scope.$on('search:init:finished', getList);

  });