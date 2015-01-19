
angular.module('cheApp')
  .controller('LineListCtrl', function($scope, Storage, http, C, Env, $location) {

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

    function loadSuccess(rtn) {
      var data = rtn.data;
      // 线路搜索返回 lineList, 周边返回 underlyingContent，收藏返回 favList
      var list = data && (data.lineList || data.underlyingContent || data.favList) || [];

      if (rtn.status && rtn.status.toLowerCase() !== 'ok' || list.length === 0) {
        $scope.noResult = true;
        return true;
      }

      if ($scope.listKey === LIST_KEY.FAVORITE) {
        ng.forEach(list, function(it) {it.isFav = true;});
      }

      $scope.list = $scope.list.concat(list);

      if (list.length < perPage) {
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
        favourite(); // 主动拉取收藏记录
      }
    });


    $scope.loadMore = function() {
      return load();
    };

    $scope.goLine = function(item) {
      searchHandlers.writeHistoryItem(item);
      $location.path('/line/' + item.lineNo + '/' + item.direction);
    };


    function load() {
      if (!$scope.loadEnded && loadData && loadPath) {
        loadedCount++;

        loadData.next = loadedCount * perPage;
        loadData.cityId = Env.cityId;

        $scope.isLoading = true;

        // 收藏页面用的是 get 请求
        var method = $scope.listKey === LIST_KEY.FAVORITE ? 'get' : 'post';

        return http[method](loadPath, loadData).success(loadSuccess).finally(function() {
          $scope.isLoading = false;
        });
      }
    }


    // 获取收藏
    function favourite() {
      loadPath = 'api/favlist';
      loadData = {};
      load();
    }


    // 全量保存收藏
    //function saveFav() {
    //  if ($scope.currentPage !== LIST_KEY.FAVORITE) {
    //    return false;
    //  }
    //  var favlist = [];
    //  ng.forEach($scope.list, function(item) {
    //    if (item.faved) {
    //      favlist.push(item);
    //    }
    //  });
    //  http.post('api/updatefav', {type: 'all', fav: JSON.stringify({data: {favlist: favlist}})});
    //}

    // 周边定位
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

    // 线路搜索
    function search(keyword) {
      if (!keyword || keyword !== lastKeyword) {
        reset();
      }
      lastKeyword = keyword;

      if (keyword) {
        $scope.listKey = LIST_KEY.SEARCH; // 触发线路搜索

        loadPath = 'api/query';
        loadData = {
          type: 'lineList',
          lineName: keyword
        };
        load();
      }
    }


  })


  .controller('LineCtrl', function($scope, http, $routeParams) {

    var lineNo = $routeParams.lineNo,
      direction = $routeParams.direction || '0',
      stationId = $routeParams.stationId;


    $scope.isLoading = false;
    $scope.status = -1;

    $scope.choseStation = function(s) {
      if (s.stationId !== stationId) {
        stationId = s.stationId;
        load();
      }
    };
    $scope.swap = function() {
      direction = direction === '1' ? '0' : '1';
      load();
    };
    $scope.refresh = function() {
      load();
    };

    $scope.fav = function(item) {
      if ($scope.current) {
        item.favStation = $scope.current.stationName;
        item.favStationId = $scope.current.stationId;
        $scope.$parent.fav(item);
      }
    };


    function loadSuccess(data) {
      data = data.data;
      $scope.isLoading = false;
      $scope.detail = data.line;
      $scope.setTitle(data.line.lineName);

      var stations = data.stations, index = data.line.order - 1;
      $scope.stations = stations;

      var current = $scope.current = stations[index];
      $scope.next = stations[index + 1] || null;
      $scope.index = index;

      $scope.status = -1;
      if (current.onTheWayNum > 0) {
        $scope.status = 0;
      }
      // 计算最近的还有几站到
      else {
        var nearestBus = 0;
        for (;index >= 0; index--) {
          if (stations[index].arrivalNum > 0 || stations[index].onTheWayNum > 0 ) {
            $scope.status = nearestBus;
            break;
          }
          nearestBus++;
        }
      }
    }

    function load(cb) {
      if ($scope.isLoading) { return false; }
      $scope.isLoading = true;
      http.post('api/query', {
        type: 'lineDetail',
        lineNo: lineNo,
        direction: direction,
        stationId: stationId
      }).success(cb || loadSuccess);
    }

    load();

  })

  .controller('SwitchCityCtrl', function($scope, http, Env) {

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


    function getCityMap (data) {
      var map = {};

      ng.forEach(['hotCity', 'allCity'], function(key) {
        ng.forEach(data[key], function(city) {
          var id = city.cityId, name = city.cityName;
          if (id && name && !(id in map)) {
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

    function locateFn(err, data) {
      var gpsRef = $scope.city.gps.list[0];
      if (err) {
        gpsRef.name = '暂时无法定位你的城市';
      } else {
        request(data).success(function(rtn) {
          var gpsCity = rtn.data.gpsCity;
          // 无法定位
          if (!gpsCity.cityName) {
            gpsRef.name = '暂时无法定位你的城市';
          }
          // 定位成功，但无公交数据
          else if (!gpsCity.cityId) {
            gpsRef.name = gpsCity.cityName + '(暂时没有这个城市的公交信息)';
          }
          // 成功
          else {
            gpsRef.name = gpsCity.cityName;
            gpsRef.id = gpsCity.cityId;
          }
        });
      }
    }

    function request(data) {
      if (!data) { data = {latitude: '0', longitude: '0'}; }
      return http.get('api/citylist?lat=:latitude&lng=:longitude', data);
    }

    request().success(function(rtn) {
      var cityMap = getCityMap(rtn.data),
        city = {
          gps: {type: 'gps', typeName: 'GPS定位城市', list: [
            {id: '000', name: '定位中...', disabled: true}
          ]},
          hot: {type: 'hot', typeName: '热门城市', list: []},
          all: {type: 'all', typeName: '所有城市', list: []}
        };

      ng.forEach(rtn.data.hotCity, function(item) { city.hot.list.push(cityMap[item.cityId]); });
      ng.forEach(rtn.data.allCity, function(item) { city.all.list.push(cityMap[item.cityId]); });
      $scope.city = city;

      $scope.getCurrentPosition(locateFn);

    });

  });