
angular.module('cheApp')
  .controller('LineSearchCtrl', function($scope, Storage, http, C, $location) {

    var searchHandlers = $scope.searchHandlers = {
      onChange: search
    };

    var lastKeyword = false, perPage = 20,
      loadedCount;

    function reset() {
      loadedCount = 0;
      $scope.loadEnded = false;
      $scope.noResult = false;
      $scope.list = [];
    }
    reset();

    $scope.loadMore = function() {
      return search(lastKeyword);
    };

    $scope.goLine = function() {
      searchHandlers.writeHistoryItem(lastKeyword);
      $location.path('/choseStation');
    };

    function search(keyword) {
      if (!keyword || keyword !== lastKeyword) {
        reset();
      }
      lastKeyword = keyword;

      if (keyword && !$scope.loadEnded) {
        return http.post('api/query', {
          'Type': 'LineList',
          'LineName': '11',
          'CityId': '004',
          next: (++loadedCount) * perPage
        }).success(function(data) {
          if (!$scope.list.length && data.data.length === 0) {
            $scope.noResult = true;
          }

          $scope.list = $scope.list.concat([
            {
              lineName: '1路',
              startStopName: '高新区地铁站',
              endStopName: '曹庄子花卉市场'
            },
            {
              lineName: '11路',
              startStopName: '高新区地铁站',
              endStopName: '曹庄子花卉市场'
            },
            {
              lineName: '111路',
              startStopName: '高新区地铁站',
              endStopName: '曹庄子花卉市场'
            },
            {
              lineName: '1路',
              startStopName: '高新区地铁站',
              endStopName: '曹庄子花卉市场'
            },
            {
              lineName: '11路',
              startStopName: '高新区地铁站',
              endStopName: '曹庄子花卉市场'
            },
            {
              lineName: '111路',
              startStopName: '高新区地铁站',
              endStopName: '曹庄子花卉市场'
            },
            {
              lineName: '111路',
              startStopName: '高新区地铁站',
              endStopName: '曹庄子花卉市场'
            }
          ]);

          if (data.data.length < perPage) {
            $scope.loadEnded = true;
          }
        });
      }
    }

  })
  .controller('SwitchCityCtrl', function($scope, $window, Env) {

    var nav = $window.navigator,
      currentCity = Env.getCurrentCity();

    $scope.chose = function(city) {
      if (!city.active && !city.disabled) {
        if (currentCity) {
          currentCity.active = false;
        }
        city.active = true;
        Env.setCurrentCity(city);
        $scope.goLastPath();
      }
    };

    var mockData = {
      GPSCity: {
        cityId: '009', cityName: '北京'
      },
      HotCity: [
        {cityId: '001', cityName: '杭州'},
        {cityId: '002', cityName: '东莞'},
        {cityId: '004', cityName: '成都'},
        {cityId: '005', cityName: '郑州'}
      ],
      AllCity: [
        {cityId: '001', cityName: '杭州'},
        {cityId: '002', cityName: '东莞'},
        {cityId: '003', cityName: '天津'},
        {cityId: '004', cityName: '成都'},
        {cityId: '005', cityName: '郑州'},
        {cityId: '006', cityName: '呼和浩特'}
      ]
    };


    function getCityMap (data) {
      var map = {};

      ng.forEach(['HotCity', 'AllCity'], function(key) {
        ng.forEach(data[key], function(city) {
          var id = city.cityId, name = city.cityName;
          if (id && name) {
            map[id] = {id: id, name: name};
            if (id === Env.cityId) {
              map[id].active = true;
              currentCity = map[id];
            }
          }
        });
      });
      return map;
    }

    function locateFn() {
      var cityMap = getCityMap(mockData),
        city = {
          gps: {type: 'gps', typeName: 'GPS定位城市', list: [
            {id: '009', name: '北京（暂时没有这个城市的公交信息）', disabled: true}
          ]},
          hot: {type: 'hot', typeName: '热门城市', list: []},
          all: {type: 'all', typeName: '所有城市', list: []}
        };

      ng.forEach(mockData.HotCity, function(item) { city.hot.list.push(cityMap[item.cityId]); });
      ng.forEach(mockData.AllCity, function(item) { city.all.list.push(cityMap[item.cityId]); });
      $scope.city = city;
    }

    $scope.getCurrentPosition(locateFn);

  })
  .controller('MyFaviconCtrl', function() {

  })
  .controller('LineAroundCtrl', function() {

  })
  .controller('ChoseStationCtrl', function() {

  });