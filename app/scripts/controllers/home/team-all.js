angular.module('moraApp')
  .controller('TeamAllCtrl', function($scope, $q, $http, $, _, Dialog, C) {
    var defaultCategory = C.team.defaultCategory;

    $scope.list = [];
    $scope.meta = {
      allChecked: false,
      allOfficial: false,
      allHot: false
    };

    function getList() {
      var query, params;
      params = $scope.search.params();
      query = $.param(_.assign({}, params.classify, params.filters, $scope.pager || {}));

      var isHot = params.filters.hot === 'yes';
      return $http.get('api/team/' + (isHot ? 'hot_groups' : '') + '?' + query)
        .success(function(data) {
          $scope.pager.total = data.total;
          $scope.list = _.map(data.studyGroups, function(team) {
            team.isHot = isHot;
            team.imageUrl = team.imageUrl || C.res.defaultAvatar;
            return team;
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
          {all: '所有小组'},
          {yes: '热门小组'}
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
        target: '.team-list'
      },
      keyword: '',
      placeholder: '搜索小组',
      searchFn: function(e, params) {
        if (params.keyword) {
          Dialog.alert('暂不支持关键字搜索');
          $scope.search.keyword = '';
        }
        return getList();
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
      return $http.delete('api/team/' + team.resourceId).success(function() {
        var index = _.findIndex($scope.list, function(item) { return item.resourceId === team.resourceId; });
        if (index !== -1) {
          $scope.list.splice(index, 1);
        }
      });
    };

    // 将指定的小组 设置或取消 热门
    $scope.hot = function(team) {
      var base = team.isHot ? '/calm_down' : '/hot';
      return $http.put('api/team/' + team.resourceId + base).success(function() {
        team.isHot = !team.isHot;
      });
    };


    // 将指定的小组 设置或取消 官方
    $scope.official = function(team) {
      if (team.isOfficial) {
        return $http.put('api/team/' + team.resourceId + '/unofficial').success(function() {
          team.isOfficial = false;
        });
      } else {
        return $http.put('api/team/' + team.resourceId + '/official').success(function() {
          team.isOfficial = true;
        });
      }
    };

  });
