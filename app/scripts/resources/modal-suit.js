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
      maxSize: 10,
      total: 1
    };

    function getList() {
      // courseId: 5171fa65fcfff27d46003553
      //$scope.listTitle = $scope.search.keyword ? '搜索到的课程' : '最近使用的课程';
      $scope.listTitle = '搜索到的课程';

      var empty = function() { $scope.list = []; };

      if (!$scope.search.keyword) {
        empty();
      } else {
        return $http.get('api/courses/' + $scope.search.keyword + '?ignoreError')
          .success(function(data) {
            // data.courseId = $scope.search.keyword;
            $scope.list = [data];
          })
          .error(empty);
      }
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


  .controller('BannerEditorCtrl', function($scope, $rootScope, $modalInstance, BannerData, C, $http) {
    $scope.type = BannerData.type;
    $scope.TYPE = C.constants.BANNER_TYPE;
    $scope.banner = BannerData || {};
    $scope.isCreate = BannerData.isCreate;

    var commit = BannerData.commit;

    var banner = $scope.banner,
      type = $scope.type,
      typeActivity = $scope.TYPE.ACTIVITY;

    $scope.isValid = function() {
      return banner.img && banner.data && banner.data.title &&
        (type === typeActivity && banner.data.url || type !== typeActivity);
    };

    function cb(data){
      delete banner.isCreate;
      if (data && data.id) {
        banner.cardId = data.id;
      }
      console.info('Save banner success:', banner);
      $modalInstance.close(banner);
    }

    $scope.save = function() {
      if (!commit) {
        return cb(null);
      }
      if (banner.isCreate) {
        $http.put('api/banners/?position=home_top', {card: getBannerCard()})
          .success(cb);
      } else {
        $http.post('api/banners/?position=home_top', {card: getBannerCard()})
          .success(cb);
      }
    };

    function getBannerCard() {
      return $rootScope.frontCardToBack(banner);
    }

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

  })


  .controller('StreamEditorCtrl', function($scope, $rootScope, $modalInstance, StreamData, C, $http, _, $filter) {
    var type = $scope.type = StreamData.type,
      TYPE = $scope.TYPE = C.constants.STREAM_TYPE,
      stream = $scope.stream = StreamData || {};

    $scope.BANNER_TYPE = C.constants.BANNER_TYPE;
    $scope.isCreate = stream.isCreate;


    $scope.setPublishAtNow = function() {
      var now = _.now();
      now -= now % 3600000;
      stream.publishAt = now;
      stream.publishAtFormat = $filter('date')(now, 'yyyy/MM/dd HH:mm');
    };



    if (!stream.publishAt) {
      $scope.setPublishAtNow();
    }
    stream.data = stream.data || [];


    function cb(data){
      delete stream.isCreate;
      if (data && data.id) {
        stream.cardId = data.id;
      }
      console.info('Save stream success:', stream);
      $modalInstance.close(stream);
    }

    $scope.save = function() {
      if (stream.isCreate) {
        $http.post('api/stream', {card: getStreamCard()}).success(cb);
      } else {
        $http.put('api/stream/' + stream.cardId, {card: getStreamCard()}).success(cb);
      }
    };


    $scope.cancel = function() {
      $modalInstance.dismiss('cancel');
    };

    $scope.isValid = function() {
      switch (stream.type) {
        case TYPE.THREAD:
          return stream.data && stream.data.id;
        case TYPE.SMALL_BANNER:
          return stream.data && stream.data.length === 2;
        case TYPE.COURSE_SET:
        case TYPE.TEAM_SET:
          return stream.data && stream.data.length === 3;
        default :
          return false;
      }
    };

    function getStreamCard() {
      return $rootScope.frontCardToBack(stream);
    }
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