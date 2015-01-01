

angular.module('moraApp')

  .controller('FrontBannerCtrl', function($scope, C, Dialog, $http, _){
    $scope.TYPE = C.constants.BANNER_TYPE;
    $scope.list = [];

    var isUpdated = false;

    $scope.isUpdated = function() {
      return isUpdated;
    };

    $scope.createBanner = function(type) {
      $scope.$parent.createBanner(type, null, false).then(function(data) {
        $scope.list.push(data);
        isUpdated = true;
      });
    };

    $scope.editBanner = function(banner) {
      $scope.$parent.editBanner(banner).then(function() {
        isUpdated = true;
      });
    };

    $scope.deleteBanner = function(index) {
      $scope.list.splice(index, 1);
      isUpdated = true;
    };

    $scope.$on('$stateChangeStart', function(e) {
      if (isUpdated && !Dialog.confirm('你的修改尚未保存，确认要离开吗？')) {
        e.preventDefault();
      }
    });

    $scope.save = function() {
      $http.post('api/cards_banners/?position=home_top', {
        cards: $scope.frontCardToBack($scope.list, true)
      }).success(function() {
        isUpdated = false;
        Dialog.alert('保存成功!');
      });
    };

    $scope.sortableOptions = {
      orderChanged: function() { isUpdated = true; }
    };

    $http.get('api/cards_banners/?position=home_top&page=1&pageSize=100').success(function(data) {
      $scope.list = _.map(data.data.cards, function(item) {
        return $scope.backCardToFront(item);
      });
      console.log('Banner data', $scope.list);
    });

  })


  .controller('FrontCourseCtrl', function($scope, $rootScope, $timeout, $http, Dialog) {
    var courseType = $rootScope.BANNER_TYPE.COURSE;

    function reset() {
      $scope.list = [{type: courseType, data: {}}, {type: courseType, data: {}}];
    }
    reset();

    $http.get('api/cards_banners/?position=course_store_top').success(function(data) {
      if (data.data.cards.length === 2) {
        $scope.list = _.map(data.data.cards, function(item) {
          return $rootScope.backCardToFront(item);
        });
      }
    });

    $scope.reset = function(index) {
      $scope.list[index] = {type: courseType, data: {}};
    };

    $scope.save = function() {
      var list = $scope.list, data,
        len = _.reduce(list, function(sum, item) { return sum + (item.img ? 1 : 0); }, 0);

      if (len === 0) {
        data = [];
      } else if (len === 2) {
        data = $rootScope.frontCardToBack($scope.list, true);
      } else {
        Dialog.alert('必须设置两门课程');
        return false;
      }

      return $http.post('api/cards_banners/?position=course_store_top', {cards: data}).success(function() {
        Dialog.alert('保存成功!');
      });
    };

  })


  .controller('FrontStreamCtrl', function($scope, $rootScope, C, $modal, _, $http, $){
    $scope.TYPE = C.constants.STREAM_TYPE;


    function getList() {
      $http.get('api/stream/?' + $.param($scope.pager)).success(function(data) {
        $scope.list = _.map(data.data.cards, function(item) {
          return $rootScope.backCardToFront(item);
        });
        $scope.pager.total = data.total;
        console.info($scope.list);
      });
    }
    $scope.$watch('pager.page', getList);

    function dialog(data) {
      return $modal.open({
        templateUrl: 'views/incs/modal-stream-editor.html',
        controller: 'StreamEditorCtrl',
        backdrop: 'static',
        windowClass: 'stream-editor-modal',
        resolve: { StreamData: function() { return data; }}
      }).result;
    }

    $scope.createStream = function(type) {
      dialog({type: type, isCreate: true}).then(function(data){ $scope.list.unshift(data); });
    };
    $scope.deleteStream = function(stream, index) {
      $http.post('api/stream/delete_cards/', {cards: $scope.frontCardToBack(stream)}).success(function() {
        $scope.list.splice(index, 1);
      });
    };
    $scope.editStream = function(stream) {
      dialog(_.cloneDeep(stream)).then(function(data) {
        _.assign(stream, data);
      });
    };

  });