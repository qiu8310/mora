/* global G */
var D = {
  shareImg: 'http://cdn-l.llsapp.com/connett/c90f1d6e-313f-49ea-b279-2844a7ccbb77',
  charges: [
    [{n: 'a', task: '10天完成课程所有关卡，闯关平均分在95分以上，集齐500赞', prize: '不仅全额返还钻石，更另外赠送200钻'},
      {n: 'b', task: '20天完成课程所有关卡，闯关平均分在90分以上，集齐500赞', prize: '全额返还钻石'},
      {n: 'c', task: '20天完成课程所有关卡，闯关平均分在85分以上，集齐500赞', prize: '返还课程价值的50%钻石'},
      {n: 'd', task: '20天完成课程所有关卡，闯关平均分在80分以上，集齐500赞', prize: '返还课程价值的20%钻石'}],

    [{n: 'a', task: '15天完成所有关卡，闯关平均分在95分以上，集齐500赞', prize: '不仅全额返还钻石，更另外赠送200钻'},
      {n: 'b', task: '30天完成所有关卡，闯关平均分在90分以上，集齐500赞', prize: '全额返还钻石'},
      {n: 'c', task: '30天完成所有关卡，闯关平均分在85分以上，集齐500赞', prize: '返还课程价值的50%钻石'},
      {n: 'd', task: '30天完成所有关卡，闯关平均分在80分以上，集齐500赞', prize: '返还课程价值的20%钻石'}]
  ],
  courses: [
    {id: '', title: '赖世雄美语入门',
      desc: '共60关，专门为入门学习者所编写，简单实用贴近生活，助您攻克日常基础会话'},
    {id: '', title: '赖世雄初级美语',
      desc: '共148关，适合稍具英语基础的学习者，内容生动新颖，为您打下坚实语法和句型基础'},
    {id: '', title: '赖世雄中级美语',
      desc: '共148关，适合有一定基础的学习者，课文涉及多个领域话题，让您从容面对口语交际和书面表达'}
  ],
  challengeDetail: function ($scope, Data, Env) {
    var endTime = Data.planEndAt,
      curTime = Env.G.currentTimestamp;

    $scope.course = ng.find(D.courses, {id: Data.courseId});
    $scope.ended = curTime >= endTime || curTime >= Env.G.huodong.endAt;

    $scope.success = Data.finishedLessonsCount >= Data.lessonsCount &&
      Data.lessonsAvgScore >= Data.planScore && Data.ballot >= Data.planLikesCount;
    $scope.failed = $scope.ended && !$scope.success;
    $scope.charging = !$scope.ended && !$scope.success;

    $scope.restSeconds = endTime - curTime;
  },
  shareData: function(type, path, courseTitle) {
    var c;
    path = path || window.location.pathname;
    courseTitle = courseTitle && courseTitle.replace('赖世雄', '');
    switch (type) {
      case 1: c = '我在参加《'+courseTitle+'》的通关任务，挑战英语大魔王，请亲们支持我！'; break;
      case 2: c = '我已完成《'+courseTitle+'》的通关任务，小伙伴们一起来战英语大魔王吧！'; break;
      case 3: c = '呜呜，《'+courseTitle+'》通关任务失败了，小伙伴们帮我完成未竟的事业！'; break;
      default:c = '传说学完《美语从头学》系列，可以轻松KO英语大魔王，小伙伴们快来一起战斗！';
    }
    return {
      url: 'http://' + window.location.host + path,
      content: c,
      img: D.shareImg
    };
  }
};
(function() {
  D.charges[2] = D.charges[1];

  var data = ng.find(ng.camelCase(G).subHuodongs, {identifier: 'study_plan'});
  data = data.data.plans;
  ng.forEach(data, function(item, id) { D.courses[item.level-1].id = id; });
})();



angular.module('moraApp')
  .directive('banner', function() {
    return {
      transclude: true,
      replace: true,
      restrict: 'E',
      scope: {title: '='},
      template: '<div class="banner bfc" ng-class="{txt: !title}">' +
        '<h1 class="text-hide" ng-if="::(!t)">赖世雄系列课程，限时闯关大挑战，你敢赌，我敢送</h1>' +
        '<h1 ng-if="::t"><span class="fg-f">赖世雄</span><br/><span class="name">{{::t}}</span></h1>' +
      '</div>',
      // 换一个变量，否则会修改父对象的 title 属性
      link: function(scope) { scope.t = scope.title && scope.title.replace('赖世雄', ''); }
    };
  })
  .directive('subTitle', function() {
    return {
      transclude: true,
      replace: true,
      template: '<div class="sub-title"><h2 class="fg-p1" ng-transclude></h2></div>'
    };
  })
  .directive('countDown', function($timeout, Env) {
    return {
      replace: true,
      scope: {restSeconds: '='},
      template: '<div class="count-down"><div class="header">{{title}}</div><div class="body">{{content}}</div></div>',
      link: function(scope) {
        var s = scope.restSeconds, days, hours, minutes, stamp = Date.now();

        if (s <= 0) { return false; }

        function cd() {
          var rest = s - Math.round((Date.now() - stamp)/1000);
          minutes = Math.floor(rest / 60);
          if (minutes > 0) {
            scope.title = '剩余分钟';
            scope.content = minutes;
          } else if (rest > 0) {
            scope.title = '剩余秒数';
            scope.content = rest;
          } else {
            Env.win.location.reload();
          }

          if (rest > 0) { $timeout(cd, 1000); }
        }

        days = Math.floor(s / 86400);
        hours = Math.floor(s / 3600);

        if (days > 0) {
          scope.title = '剩余天数';
          scope.content = days;
        } else if (hours > 0) {
          scope.title = '剩余小时';
          scope.content = hours;
        } else {
          cd();
        }
      }
    };
  })
  .directive('progressBar', function() {
    return {
      replace: true,
      scope: {title: '@', target: '@', current: '@', width: '='},
      template: '<div class="progress">' +
      '<div class="header"><span class="start">{{::title}}：</span><span class="end">{{::target}}</span></div>' +
      '<div class="body"><div class="run" style="width: {{100 * width}}%"></div>' +
      '<div class="txt">{{current}}</div></div></div>'
    };
  })

  .controller('CourseInfoCtrl', function(Env, $scope, Native) {

    $scope.mainAct = Env.G.huodong;
    $scope.applyAct = ng.find(Env.G.subHuodongs, {identifier: 'study_plan'});
    $scope.charges = D.charges;

    $scope.share = function() {
      Env.ga('分享');
      if (!Env.Platform.isLLS) { Native.getLLSApp(); return false; }
      Native.share(D.shareData(0));
    };
  })
  .controller('CourseFightingCtrl', function($scope, Data, Env, Native, $location, $routeParams, http, $timeout) {
    D.challengeDetail($scope, Data, Env);
    $scope.Data = Data;

    $scope.vote = function() {
      Env.ga('点赞');
      http.post('api/user_vote?user_id=' + $routeParams.uid, {'user_id': $routeParams.uid})
        .success(function(data) {
          $scope.voteSuccessToast = true;
          Data.tickets = data.tickets;
          Data.ballot = data.ballot;
          $timeout(function() {
            $scope.voteSuccessToast = false;
          }, 2800);
        });
    };
    $scope.share = function() {
      Env.ga('分享');
      if (Env.Platform.isLLS) {
        var path = Env.win.location.pathname + '?hash=' + $location.path();
        Native.share(D.shareData($scope.charging ? 1 : $scope.success ? 2 : 3, path, $scope.course.title));
      } else {
        $scope.goHome();
      }
    };
  })

  .controller('CourseChargeCtrl', function($scope, $routeParams, http, Native, Env, Data) {
    if (!Env.Platform.isLLS) { Native.getLLSApp(); return false; }

    $scope.charges = D.charges[$routeParams.courseIndex];
    var course = $scope.course = D.courses[$routeParams.courseIndex];

    $scope.charged = Data && ng.find($scope.charges, {n: Data.planType});

    $scope.charge = null;
    $scope.goToCourse = function() {
      Native.addModule(course.id);
    };
    $scope.acceptChallenge = function() {
      http.post('api/study_plan', {'course_id': course.id, 'plan_type': $scope.charge.n})
        .success(function() { Env.path('/' + Env.G.currentUser.id + '/fighting'); })
        .finally(function() { $scope.challengeTipModal = true; });
    };
    $scope.challenge = function(charge, done) {
      Env.ga('我要挑战');
      http.get('api/course?course_id=:id', course).success(function(data){
        done();
        if (!data.isPaid) {
          $scope.buyTipModal = true;
        } else {
          $scope.charge = charge;
          $scope.challengeTipModal = true;
        }
      });
    };
    $scope.share = function() {
      Env.ga('分享');
      Native.share(D.shareData(0));
    };
  })

  .controller('CourseHomeCtrl', function($scope, Data, Env, Native) {
    $scope.courses = D.courses;
    $scope.applied = !!Data;

    var applyAct = ng.find(Env.G.subHuodongs, {identifier: 'study_plan'});
    $scope.applyAct = applyAct;
    $scope.expired = applyAct.endAt <= Env.G.currentTimestamp;
    $scope.canApply = !$scope.applied && !$scope.expired;

    var uid = Env.G.currentUser.id;
    if (Data) { D.challengeDetail($scope, Data, Env); }

    $scope.goToInfo = function() {
      Env.ga('活动详情');
      Env.path('/info');
    };
    $scope.fightingInfo = function() {
      Env.ga('学习进度');
      if (!Env.Platform.isLLS) { Native.getLLSApp(); return false; }
      if (Data) {
        Env.path('/' + uid + '/fighting');
      } else {
        $scope.chargeTipModal = true;
      }
    };

    $scope.learn = function(index) {
      Env.ga('我要免费学');
      if (!Env.Platform.isLLS) { Native.getLLSApp(); return false; }

      Env.path('/' + uid + '/charge/' + index);
    };

    $scope.share = function() {
      Env.ga('分享');
      if (!Env.Platform.isLLS) { Native.getLLSApp(); return false; }
      Native.share(D.shareData(0));
    };
  });