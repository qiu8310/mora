/* jshint camelcase:false */

angular.module('moraApp')
  .controller('HomeCtrl', function ($scope, $rootScope, Auth, $modal, $http, _, C) {
    $scope.user = Auth.getLoginUser();


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

    $rootScope.createBanner = function(type, list, commit) {
      commit = _.isUndefined(commit) ? true : !!commit;
      return $scope.editBanner({type: type, isCreate: true, commit: commit}).then(function(data) {
        if (list) {
          list.push(data);
        }
        return data;
      });
    };

    $rootScope.editBanner = function(banner, list, index) {
      return $modal.open({
        templateUrl: 'views/incs/modal-banner-editor.html',
        controller: 'BannerEditorCtrl',
        backdrop: 'static',
        windowClass: 'banner-editor-modal',
        resolve: {
          BannerData: function() { return banner; }
        }
      }).result.then(function(data) {
          if (list && index >= 0) {
            list[index] = data;
          }
          return data;
        });
    };


    $rootScope.frontCardToBack = function(card, _isSmallBanner) {
      var data = card.data, result,
        TYPE = C.constants.STREAM_TYPE,
        BANNER_TYPE = C.constants.BANNER_TYPE;
      switch (card.type) {
        case TYPE.THREAD:
        case BANNER_TYPE.THREAD:
          result = {
            type: 'forum_topic',
            'topic_id': data.id
          }; break;
        case TYPE.TEAM_SET:
        case BANNER_TYPE.TEAM:
          data = [].concat(data);
          result = {
            type: 'study_group_set',
            'group_ids': _.map(data, function(o) { return o.resourceId || o.data.resourceId; })
          };
          break;
        case TYPE.COURSE_SET:
        case BANNER_TYPE.COURSE:
          data = [].concat(data);
          result = {
            type: 'course_set',
            'course_ids': _.map(data, function(o) { return o.id || o.data.id; })
          }; break;
        case BANNER_TYPE.ACTIVITY:
          result = {
            type: 'huo_dong',
            name: data.title,
            url: card.url
          }; break;
        case TYPE.SMALL_BANNER:
          data = [].concat(data);
          result = {
            type: 'banner',
            cards: _.map(data, function(banner) {
              return $rootScope.frontCardToBack(banner, true);
            })
          }; break;
        default :
          throw new Error('不支持数据类型');
      }

      if (!_isSmallBanner) {
        result.cover_url = card.img;
        result.published_at = Math.round((card.publishAt || _.now())/1000);
      }

      return result;
    };

    $rootScope.backCardToFront = function(card) {
      var TYPE = C.constants.STREAM_TYPE, data,
        BANNER_TYPE = C.constants.BANNER_TYPE;

      // publishedAt, id
      switch (card.type) {
        case 'study_group_set':
          data = {
            type: TYPE.TEAM_SET,
            data: _.map(card.groups, function(o) {
              return {
                type: BANNER_TYPE.TEAM,
                data: o
              };
            })
          };
          break;
        case 'forum_topic':
          data = {type: TYPE.THREAD, data: card.topic};
          break;
        case 'course_set':
          data = {
            type: TYPE.COURSE_SET,
            data: _.map(card.courses, function(o) {
              return {
                type: BANNER_TYPE.COURSE,
                data: o
              };
            })
          };
          break;

        case 'banner':
          data = {
            type: TYPE.SMALL_BANNER,
            data: _.map(card.cards, function(o) {
              var item;
              switch (o.type) {
                case 'huo_dong':
                  item = {
                    type: BANNER_TYPE.ACTIVITY,
                    data: {
                      title: o.name,
                      url: o.url
                    }}; break;
                case 'forum_topic':
                  item = {
                    type: BANNER_TYPE.THREAD,
                    data: o.topic
                  };break;
                case 'study_group_set':
                  item = {
                    type: BANNER_TYPE.TEAM,
                    data: o.groups.pop()
                  };break;
                case 'course_set':
                  item = {
                    type: BANNER_TYPE.COURSE,
                    data: o.courses.pop()
                  };break;
                default : throw new Error('不支持数据类型' + o.type);
              }
              item.img = o.coverUrl;
              return item;
            })
          };
          break;

        // bad data
        case 'huo_dong': data = {}; break;
        default : throw new Error('不支持数据类型' + card.type);
      }

      data.cardId = card.id;
      data.publishAt = new Date(card.publishedAt * 1000);
      return data;

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
