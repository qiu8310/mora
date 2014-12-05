angular.module('moraApp')
  .directive('searchFilter', function (_, $, Storage, C, $rootScope) {

    function updateListGroup(group) {
      if (group) {
        var activeKey = group.active;
        if (activeKey && group.list) {
          _.each(group.list, function(obj, index) {
            var keys = _.keys(obj);
            group.list[index] = keys.length === 1 ? {key: keys[0], name: obj[keys[0]]} : obj;
          });
          group.activeItem = _.find(group.list, function(obj) { return obj.key === activeKey; });
        }
      }
    }

    function getFilterParams(filters) {
      var obj = {};
      _.each(filters, function(filter) {
        if (filter) {
          obj[filter.key] = filter.activeItem.key;
        }
      });
      return obj;
    }


    return {
      templateUrl: 'views/tpls/search-filter.html',
      restrict: 'E',
      replace: true,
      scope: {
        filters: '=',
        search: '='
      },
      link: function postLink(scope, element, attrs) {
        _.each(scope.filters, updateListGroup);
        updateListGroup(scope.search.classify);

        scope.search.params = function() {
          return {
            keyword: $.trim(scope.search.keyword),
            filters: getFilterParams(scope.filters),
            classify: getFilterParams([scope.search.classify])
          };
        };

        $rootScope.$broadcast('search:init:finished');

        var history = Storage.get('searchHistory', []);
        scope.searchHistory = history;

        scope.quickSearch = function(keyword) {
          scope.search.keyword = keyword;
        };

        scope.searchFn = function(e) {
          e.preventDefault();
          var promise, keyword, params;
          if (scope.search.searchFn) {
            params = scope.search.params();
            keyword = params.keyword;

            promise = scope.search.searchFn(e, params);

            if (keyword) {
              // 保存历史记录
              var historyExistIndex = history.indexOf(keyword);
              if (historyExistIndex >= 0) {
                history.splice(historyExistIndex, 1);
              }
              history.unshift(keyword);
              if (history.length > C.search.historyLength) {
                history = history.slice(0, C.search.historyLength);
              }
              scope.searchHistory = history;
              Storage.set('searchHistory', history);
            }
          }

          return promise;
        };

        console.info(scope.search, scope.filters);
      }
    };
  });
