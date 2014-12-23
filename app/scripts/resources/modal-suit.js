angular.module('moraApp')
  .controller('ThreadFinderCtrl', function($scope, $http, $modalInstance) {
    $scope.pager = {
      page: 1,
      pageSize: 6,
      maxSize: 10
    };

    function getList() {
      //$scope.listTitle = $scope.search.keyword ? '搜索到的帖子' : '最近使用的帖子';
      $scope.listTitle = '搜索到的帖子';
      return $http.get('api/forum/search/?' + $scope.search.params().toQuery())
        .success(function(data) {
          $scope.pager.total = data.total;
          $scope.list = data.topics;
        });
    }

    $scope.search = {
      async: {target: '.modal-thread-list'},
      options: {hideLatestSearch: true},
      placeholder: '请输入帖子标题',
      searchFn: getList,
      cleanFn: getList
    };

    $scope.$watch('pager.page', _.ignoreFirstCall(getList));
    $scope.$on('search:init:finished', getList);
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
    $scope.select = function(thread) {
      $modalInstance.close(thread);
    };
  })


  .controller('TeamFinderCtrl', function($scope, $http, $modalInstance) {
    $scope.pager = {
      page: 1,
      pageSize: 6,
      maxSize: 10
    };

    function getList() {
      //$scope.listTitle = $scope.search.keyword ? '搜索到的小组' : '最近使用的小组';
      $scope.listTitle = '搜索到的小组';
      return $http.get('api/team/?' + $scope.search.params().toQuery())
        .success(function(data) {
          $scope.pager.total = data.total;
          $scope.list = data.studyGroups;
        });
    }

    $scope.search = {
      async: {target: '.modal-team-list'},
      options: {hideLatestSearch: true},
      placeholder: '请输入小组名称',
      searchFn: getList,
      cleanFn: getList
    };

    $scope.$watch('pager.page', _.ignoreFirstCall(getList));
    $scope.$on('search:init:finished', getList);
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
    $scope.select = function(team) {
      $modalInstance.close(team);
    };

  })


  .controller('CourseFinderCtrl', function($scope, $http, $modalInstance) {
    $scope.pager = {
      page: 1,
      pageSize: 6,
      maxSize: 10
    };

    function getList() {
      //$scope.listTitle = $scope.search.keyword ? '搜索到的课程' : '最近使用的课程';
      $scope.listTitle = '搜索到的课程';
    }

    $scope.search = {
      async: {target: '.modal-course-list'},
      options: {hideLatestSearch: true},
      placeholder: '请输入课程ID',
      searchFn: getList,
      cleanFn: getList
    };

    $scope.$watch('pager.page', _.ignoreFirstCall(getList));
    $scope.$on('search:init:finished', getList);
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
    $scope.select = function(course) {
      $modalInstance.close(course);
    };

  })


  .controller('BannerEditorCtrl', function($scope, $modalInstance, BannerType, BannerData, C, $http) {
    $scope.type = BannerType;
    $scope.TYPE = C.constants.BANNER_TYPE;
    $scope.banner = BannerData || {};
    $scope.isCreate = !BannerData;

    _.each(['findThread', 'findTeam', 'findCourse'], function(key) {
      $scope[key] = function() {
        $scope.$parent[key]().then(function(data){ $scope.banner.data = data; });
      };
    });

    $scope.save = function() {
      $modalInstance.close({
        type: $scope.type,
        banner: $scope.banner,
        isCreate: $scope.isCreate
      });
    };
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

  })


  .controller('ThreadEditorCtrl', function($scope, $modalInstance, ThreadData, $http, _) {
    $scope.thread = {};

    var fields = ['title', 'body'];
    _.each(fields, function(key) {
      $scope.thread[key] = ThreadData[key];
    });

    $scope.save = function() {
      if (_.any(fields, function(key) { return $scope.thread[key] !== ThreadData[key]; })) {

        return $http.put('api/forum/' + ThreadData.id + '/', $scope.thread).then(function() {
          _.each($scope.thread, function(val, key) {
            ThreadData[key] = val;
          });
          $modalInstance.close($scope.thread);
        });
      } else {
        $modalInstance.dismiss('nothing_change');
      }

    };

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };
  });