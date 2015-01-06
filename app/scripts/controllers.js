
angular.module('cheApp')
  .controller('LineSearchCtrl', function($scope, Storage, http, C, $location) {

    var LIST_KEY = {AROUND: 'around', SEARCH: 'search', FAVORITE: 'favourite'};

    var lastKeyword = false,
      perPage = 20,
      loadPath,
      loadData,
      loadedCount;

    var searchHandlers = $scope.searchHandlers = {
      onChange: search
    };

    function reset() {
      loadedCount = 0;
      $scope.loadEnded = false;
      $scope.noResult = false;
      $scope.locateError = false;

      $scope.isLoading = false;
      $scope.list = [];
    }

    function loadSuccess(data) {
      data = data || {data: [
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
        }]}; // for test;

      if (!$scope.list.length && data.data.length === 0) {
        $scope.noResult = true;
      }

      $scope.list = $scope.list.concat(data.data);

      if ((Math.random() * 100) < 20 && data.data.length < perPage) {
        $scope.loadEnded = true;
      }
    }


    $scope.listKey = null;
    $scope.LIST_KEY = LIST_KEY;
    $scope.$on('$routeChangeSuccess', function(e, route) {
      // listKey 会根据行为变化而变化，但 currentPage 是不变的
      $scope.listKey = route.$$route.data.listKey;
      $scope.currentPage = $scope.listKey;

      // 初始化基本数据
      reset();

      // 如果是周边列表，则首先定位
      if ($scope.currentPage === LIST_KEY.AROUND) {
        $scope.isLocating = true;
        $scope.getCurrentPosition(locate);

      } else if ($scope.currentPage === LIST_KEY.FAVORITE) {
        $scope.noFavorite = true;
      }
    });



    $scope.loadMore = function() {
      return load();
    };

    $scope.goLine = function() {
      searchHandlers.writeHistoryItem(lastKeyword);
      $location.path('/choseStation');
    };


    function load() {
      if (!$scope.loadEnded && loadData && loadPath) {
        loadedCount++;

        loadData.next = loadedCount * perPage;
        loadData.CityId = '004';

        $scope.isLoading = true;

        return http.post(loadPath, loadData).success(loadSuccess).finally(function() {
          $scope.isLoading = false;
        });
      }
    }

    function favourite() {

    }

    function locate(err, data) {
      $scope.isLocating = false;
      if (err) {
        $scope.locateError = true;
      } else {
        loadPath = 'api/querynearby';
        loadData = {
          lat: data.latitude,
          lng: data.longitude
        };
        load();
      }
      $scope.$apply();
    }

    function search(keyword) {
      if (!keyword || keyword !== lastKeyword) {
        reset();
      }
      lastKeyword = keyword;

      if (keyword) {
        $scope.listKey = LIST_KEY.SEARCH; // 触发线路搜索

        loadPath = 'api/query';
        loadData = {
          type: 'LineList',
          lineName: keyword
        };
        load();
      }
    }

  })
  .controller('SwitchCityCtrl', function($scope, Env) {

    var currentCity = Env.getCurrentCity();

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
  .controller('FavouriteCtrl', function() {

  });