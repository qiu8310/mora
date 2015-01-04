/* jshint camelcase:false */

angular.module('moraApp')
  .controller('HomeCtrl', function ($scope, $rootScope, Auth, $modal, $http, _, C) {
    $scope.user = Auth.getLoginUser();


    $rootScope.res = C.res;
    $rootScope.BANNER_TYPE = C.constants.BANNER_TYPE;
    $rootScope.STREAM_TYPE = C.constants.STREAM_TYPE;

    function _appendFinderToContainer(data, container, index, type) {
      if (container) {
        if (_.isArray(container)) {
          container[index] = {data: data, type: type};
        } else {
          if (!container.type) {
            container.type = type;
          }
          container.data = data;
        }
      }
      return data;
    }

    $rootScope.findThread = function(container, index) {
      return $modal.open({
        templateUrl: 'views/incs/modal-thread-finder.html',
        controller: 'ThreadFinderCtrl',
        backdrop: 'static',
        size: 'lg',
        windowClass: 'thread-finder-modal'
      }).result.then(function(data) {
          return _appendFinderToContainer(data, container, index, C.constants.BANNER_TYPE.THREAD);
        });
    };

    $rootScope.findTeam = function(container, index) {
      return $modal.open({
        templateUrl: 'views/incs/modal-team-finder.html',
        controller: 'TeamFinderCtrl',
        backdrop: 'static',
        size: 'lg',
        windowClass: 'team-finder-modal'
      }).result.then(function(data) {
          return _appendFinderToContainer(data, container, index, C.constants.BANNER_TYPE.TEAM);
        });
    };

    $rootScope.findCourse = function(container, index) {
      return $modal.open({
        templateUrl: 'views/incs/modal-course-finder.html',
        controller: 'CourseFinderCtrl',
        backdrop: 'static',
        size: 'lg',
        windowClass: 'course-finder-modal'
      }).result.then(function(data) {
          return _appendFinderToContainer(data, container, index, C.constants.BANNER_TYPE.COURSE);
        });
    };


    $rootScope.createBanner = function(type, list, commit) {
      commit = _.isUndefined(commit) ? true : !!commit;

      return $scope.editBanner({type: type, isCreate: true, commit: commit}).then(function(data) {
        if (list) {
          list.push(data);
        }
        return data;
      });
    };

    $rootScope.editBanner = function(banner) {
      return $modal.open({
        templateUrl: 'views/incs/modal-banner-editor.html',
        controller: 'BannerEditorCtrl',
        backdrop: 'static',
        windowClass: 'banner-editor-modal',
        resolve: {
          BannerData: function() { return _.cloneDeep(banner); }
        }
      }).result.then(function(data) {
          _.assign(banner, data);
          return data;
        });
    };


    var COVER = 'cover';
    var _FtB = $rootScope.frontCardToBack = function(card, batch) {
      if (batch) {
        return _.map(card, function(item) { return _FtB(item); });
      }

      var data = card.data, datas, result,
        STREAM_TYPE = C.constants.STREAM_TYPE,
        BANNER_TYPE = C.constants.BANNER_TYPE;

      datas = [].concat(data);
      data = datas[0];

      switch (card.type) {
        case STREAM_TYPE.THREAD:
        case BANNER_TYPE.THREAD:
          result = {
            type: 'forum_topic',
            data: data.id
          }; break;
        case STREAM_TYPE.TEAM_SET:
          result = {
            type: 'study_group_set',
            data: _.map(datas, function(o) { return o.resourceId || o.data.resourceId; })
          }; break;
        case BANNER_TYPE.TEAM:
          result = {
            type: 'study_group',
            data: data.resourceId || data.data.resourceId
          }; break;
        case STREAM_TYPE.COURSE_SET:
          result = {
            type: 'course_set',
            data: _.map(datas, function(o) { return o.id || o.data.id; })
          }; break;
        case BANNER_TYPE.COURSE:
          result = {
            type: 'course',
            data: data.id || data.data.id
          }; break;
        case BANNER_TYPE.ACTIVITY:
          result = {
            type: 'huo_dong',
            data: {name: data.title, cover: card.img, url: data.url}
          }; break;
        case STREAM_TYPE.SMALL_BANNER:
          result = {
            type: 'banner',
            data: {
              cards: _.map(datas, function(banner) {
                return _FtB(banner);
              })
            }
          }; break;
        default :
          throw new Error('不支持数据类型');
      }

      if (card.pubtime) { result.pubtime = Math.round((card.pubtime - 0)/1000); }
      if (card.id) { result.id = card.id; }
      result[COVER] = card.img;
      return result;
    };

    var _BtF = $rootScope.backCardToFront = function(card, isBanner) {
      var STREAM_TYPE = C.constants.STREAM_TYPE, result,
        BANNER_TYPE = C.constants.BANNER_TYPE, type, data;

      // publishedAt, id
      switch (card.type) {
        case 'study_group_set':
          type = STREAM_TYPE.TEAM_SET;
          data = _.map(card.data.groups, function(d) {
            return {
              type: BANNER_TYPE.TEAM,
              data: d
            };
          });
          break;
        case 'study_group':
          type = BANNER_TYPE.TEAM; break;
        case 'forum_topic':
          type = BANNER_TYPE.THREAD; break;
        case 'course_set':
          type = STREAM_TYPE.COURSE_SET;
          data = _.map(card.data.courses, function(d) {
            return {
              type: BANNER_TYPE.COURSE,
              data: d
            };
          });
          break;
        case 'course':
          type = BANNER_TYPE.COURSE; break;
        case 'banner':
          type = STREAM_TYPE.SMALL_BANNER;
          data = _.map(card.data.cards, function(d) {
            return _BtF(d);
          });
          break;
        case 'huo_dong':
          data = {title: card.data.name, url: card.data.url};
          type = BANNER_TYPE.ACTIVITY; break;
        default : throw new Error('不支持数据类型' + card.type);
      }

      result = {id: card.id, type: type, data: data || card.data};
      if (card[COVER]) { result.img = card[COVER]; }
      if ('pubtimeCountdown' in card) { result.pubtimeCountdown = card.pubtimeCountdown; }
      if ('pubtime' in card) { result.pubtime = card.pubtime * 1000; }

      return result;

    };


    $rootScope.editThread = function(thread) {
      return $modal.open({
        templateUrl: 'views/incs/modal-thread-editor.html',
        controller: 'ThreadEditorCtrl',
        backdrop: 'static',
        windowClass: 'thread-editor-modal',
        resolve: {
          ThreadData: function() { return thread; }
        }
      }).result;
    };



    $scope.hotThread = function(thread) {
      var api = thread.isHot ? 'calm_down' : 'make_hot';
      return $http.put('api/forum/' + thread.id + '/' + api).success(function() {
        thread.isHot = !thread.isHot;
      });
    };

    $scope.deleteThread = function(thread) {
      var cb = function() { thread.isDeleted = !thread.isDeleted; };
      if (thread.isDeleted) {
        return $http.put('api/forum/' + thread.id + '/restore').success(cb);
      } else {
        return $http.delete('api/forum/' + thread.id).success(cb);
      }
    };

    $scope.indexThread = function(thread) {
      return $http[thread.isHome ? 'delete' : 'post']('api/forum/' + thread.id + '/home/').success(function() {
        thread.isHome = !thread.isHome;
      });
    };

    $scope.recommendThread = function(thread) {
      var op = thread.isRecommended ? 'delete' : 'post';
      return $http[op]('api/forum/' + thread.id + '/recommend').success(function() {
        thread.isRecommended = !thread.isRecommended;
      });
    };

    $scope.essenceThread = function(thread) {
      var op = thread.isEssential ? 'delete' : 'post';
      return $http[op]('api/forum/' + thread.id + '/essence').success(function() {
        thread.isEssential = !thread.isEssential;
      });
    };


  });
