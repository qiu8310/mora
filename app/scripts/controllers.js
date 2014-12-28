
angular.module('cheApp')
  .controller('LineSearchCtrl', function($scope, Storage, http, C) {

    var searchHistory = $scope.searchHistory = Storage.get('LineSearchHistory') || [];
    var searchHandlers = $scope.searchHandlers = {
      onChange: search
    };

    function writeToHistory(key) {
      var index = searchHistory.indexOf(key),
        len = C.app.searchHistoryLength;
      if ( index >= 0 || searchHistory.length === len) {
        $scope.searchHistory.splice(index >= 0 ? index : len - 1, 1);
      }
      searchHistory.unshift(key);
      Storage.set('LineSearchHistory', searchHistory, true);
    }

    $scope.clearSearchHistory = function() {
      searchHistory = $scope.searchHistory = [];
      Storage.del('LineSearchHistory');
    };


    function search(keyword) {
      if (!keyword) { return false; }
      http.post('api/query', {
        'Type': 'LineList',
        'LineName': '16',
        'CityId': '004',
        next: 20
      }).success(function(data) {
        if (data.data.length > 0) { writeToHistory(keyword); }
      });
    }


    $scope.setKeyword = function(keyword) {
      ng.info(keyword);
      searchHandlers.keyword(keyword);
    };



  })
  .controller('SwitchCityCtrl', function() {

  })
  .controller('MyFaviconCtrl', function() {

  })
  .controller('ChoseStationCtrl', function() {

  });