angular.module('moraApp')
  .controller('TeamAllCtrl', function($scope, $q, $http, $, _, Dialog, C) {
    var defaultCategory = C.team.defaultCategory;

    $scope.list = [];
    $scope.meta = {
      allChecked: false,
      allOfficial: false,
      allHot: false
    };

    function getList(params) {
      params = params || {category: defaultCategory};
      var hot = params.hot === 'yes' ? '/hot_groups' : '';
      return $http.get('api' + hot + '?' + $.param(params)).success(function(data) {
        $scope.list = data.studyGroups;
      });
    }

    $scope.filters = [
      {
        key: 'category',
        active: defaultCategory,
        list: _.cloneDeep(C.team.categories)
      },
      {
        key: 'hot',
        active: 'no',
        list: [
          {yes: '热门小组'},
          {no: '非热门小组'}
        ]
      }
    ];


    $scope.search = {
      async: {
        target: '.team-list'
      },
      keyword: '',
      placeholder: '搜索小组',
      searchFn: function(e, keyword, filters) {
        if (keyword) {
          Dialog.alert('暂不支持关键字搜索');
          $scope.search.keyword = '';
        }

        var params = _.cloneDeep(filters.classify);
        _.assign.apply(_, [params].concat(filters.filters));
        return getList(params);
      },

      classify: {
        key: 'type',
        active: 'name',
        list: [
          {name: '组名'},
          {number: '组号'},
          {tag: '标签'},
          {author: '创建者'}
        ]
      }
    };


    // 全选 或 反选
    $scope.$watch('meta.allChecked', function(val) {
      _.each($scope.list, function(team) { team.checked = val; });
    });


    // 删除指定的小组
    $scope.dismiss = function(team) {
      return $http.delete('api/' + team.resourceId).success(function() {
        var index = _.findIndex($scope.list, function(item) { return item.resourceId === team.resourceId; });
        if (index !== -1) {
          $scope.list.splice(index, 1);
        }
      });
    };

    // 将指定的小组 设置或取消 热门
    $scope.hot = function(team) {
      var base = team.isHot ? '/calm_down' : '/hot';
      return $http.put('api/' + team.resourceId + base).success(function() {
        team.isHot = !team.isHot;
      });
    };


    // 将指定的小组 设置或取消 官方
    $scope.official = function(team) {
      Dialog.alert('后台暂不支持!');
    };


    getList();

  });