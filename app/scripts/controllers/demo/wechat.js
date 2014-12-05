'use strict';

angular.module('moraApp')
  .controller('DemoWechatCtrl', function ($scope, Wechat) {
    var img = 'http://lesson-production.qiniudn.com/connett/1f2c5c1f-e83d-461e-9b7f-fff3f54681ab',
      link = 'http://www.baidu.com';

    $scope.netType = 'unknown';
    Wechat.getNetworkType(function(t) {
      window.alert(t);
      $scope.netType = t;
    });

    $scope.close = function() { Wechat.close(); };
    $scope.hideOptionMenu = function() { Wechat.hideOptionMenu(); };
    $scope.showOptionMenu = function() { Wechat.showOptionMenu(); };
    $scope.hideToolbar = function() { Wechat.hideToolbar(); };
    $scope.showToolbar = function() { Wechat.showToolbar(); };

    $scope.timeline = function() {
      Wechat.shareToTimeline({
        desc: '分享到朋友圈',
        img: img,
        link: link
      });
      Wechat.shareTip();
    };

    $scope.friend = function() {
      Wechat.shareToFrient({
        desc: '分享到好友',
        img: img,
        link: link,
        title: '分享到好友标题'
      });
      Wechat.shareTip();
    };

    $scope.friendNoTitle = function() {
      Wechat.shareToFrient({
        desc: '分享到好友无标题',
        img: img,
        link: link
      });
      Wechat.shareTip();
    };

    $scope.email = function() {
      Wechat.shareToEmail({
        desc: '发送邮件',
        img: img
      });
      Wechat.shareTip();
    };

    $scope.weibo = function() {
      Wechat.shareToWeibo({
        desc: '分享到微博',
        img: img
      });
      Wechat.shareTip();
    };

    $scope.weiboNoImg = function() {
      Wechat.shareToWeibo({
        desc: '分享到微博无图片'
      });
      Wechat.shareTip();
    };

    $scope.weiboWithLink = function() {
      Wechat.shareToWeibo({
        desc: '分享到微博带URL',
        img: img,
        link: link
      });
      Wechat.shareTip();
    };


    // ========================================
    $scope.share = function() {
      Wechat.share({
        desc: '同步分享',
        title: '同步分享标题，回调和异步都没标题',
        img: img,
        link: link
      });
      Wechat.shareTip();
    };


    $scope.shareCb = function() {
      Wechat.share(function() {
        return {
          desc: '同步分享回调',
          title: '',
          img: img,
          link: link
        };
      });
      Wechat.shareTip();
    };

    $scope.shareAsyn = function() {
      Wechat.share(function(cb) {
        setTimeout(function() {
          return {
            desc: '同步分享异步',
            title: '',
            img: img,
            link: link
          };
        }, 500)
      });
      Wechat.shareTip();
    };

    $scope.shareParams = function() {
      Wechat.share(function() {
        return {
          desc: '同步分享参数各异',
          timelineDesc: '同步分享参数各异-朋友圈',
          friendDesc: '同步分享参数各异-朋友',
          emailDesc: '同步分享参数各异-邮件',

          title: '同步分享参数各异',
          friendTitle: '同步分享参数各异标题-朋友',

          img: img,
          timelineImg: 'http://lesson-production.qiniudn.com/connett/ef1d9340-0ddc-451f-b5cc-81e663af910f',
          friendImg: 'http://lesson-production.qiniudn.com/connett/b9ce1c9a-18cf-4c5f-b8fc-e692dcba54a8',
          emailImg: 'http://lesson-production.qiniudn.com/connett/24771d44-259d-492a-8786-f1cdd21e68de',

          link: link,
          timelineLink: 'http://www.qq.com',
          friendLink: 'http://github.com',
          emailLink: 'http://github.com/qiu8310'
        };
      });
      Wechat.shareTip();
    };

  });
