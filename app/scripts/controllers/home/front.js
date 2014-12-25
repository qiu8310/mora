

angular.module('moraApp')

  .controller('FrontBannerCtrl', function($scope, C, Dialog, $http){
    $scope.TYPE = C.constants.BANNER_TYPE;
    $scope.list = [];

    var isUpdated = false;

    $scope.isUpdated = function() {
      return isUpdated;
    };

    $scope.createBanner = function(type) {
      $scope.$parent.createBanner(type).then(function(data) {
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

    //$scope.$on('$stateChangeStart', function(e) {
    //  if (isUpdated && !Dialog.confirm('你的修改尚未保存，确认要离开吗？')) {
    //    e.preventDefault();
    //  }
    //});

    $http.get('api/banners/?position=home_page&page=1&pageSize=100', function(data) {
      console.log(data);
    });

  })


  .controller('FrontCourseCtrl', function($scope, $rootScope, $http, Dialog) {
    var courseType = $rootScope.BANNER_TYPE.COURSE;
    $scope.list = [{type: courseType, data: {}}, {type: courseType, data: {}}];

    $scope.save = function() {
      var data = $rootScope.frontCardToBack({type: $rootScope.STREAM_TYPE.SMALL_BANNER, data: $scope.list});
      return $http.post('api/banners/?position=courses_library', data).success(function() {
        Dialog.alert('保存成功!');
      });
    };

    $scope.sortableOptions = {
      accept: function() { return true; },
      dragEnd: function() {}
    };
  })


  .controller('FrontStreamCtrl', function($scope, $rootScope, C, $modal, _, $http, $){
    $scope.TYPE = C.constants.STREAM_TYPE;


    function getList() {
      $http.get('api/stream/?' + $.param($scope.pager)).success(function(data) {
        $scope.list = _.map(data.items, function(item) {
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
    $scope.deleteStream = function(id, index) {
      $http.delete('api/stream/' + id).success(function() {
        $scope.list.splice(index, 1);
      });
    };
    $scope.editStream = function(stream) {
      dialog(_.cloneDeep(stream)).then(function(data) {
        _.assign(stream, data);
      });
    };

  });