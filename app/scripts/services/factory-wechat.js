angular.module('moraApp')
  .factory('Wechat', function() {
    /* global WeixinJSBridge */
    /*jshint camelcase: false */
    'use strict';


    // WeixinJSBridgeReady 事件肯定触发完 微信相关操作才有效
    var listenEvents = {
        'shareToFrient'  : ['menu:share:appmessage', 'sendAppMessage'],
        'shareToTimeline': ['menu:share:timeline', 'shareTimeline'],
        'shareToWeibo'   : ['menu:share:weibo', 'shareWeibo'],
        'shareToEmail'   : [false, 'sendEmail']
      },
      _checkFuncs = [];

    function _weixinReady() {
      var cb;
      while((cb = _checkFuncs.shift())) {
        cb();
      }
    }

    function _check(cb) {
      if (typeof WeixinJSBridge === 'undefined') {
        if (!_checkFuncs.length) {
          document.addEventListener('WeixinJSBridgeReady', _weixinReady);
        }
        _checkFuncs.push(cb);
      } else {
        cb();
      }
    }

    function call() {
      var args = [].slice.call(arguments, 0);
      _check(function() {
        WeixinJSBridge.call.apply(WeixinJSBridge, args);
      });
    }

    function on() {
      var args = [].slice.call(arguments, 0);
      _check(function() {
        WeixinJSBridge.on.apply(WeixinJSBridge, args);
      });
    }


    // 当 eve 不存在时，cb 的回调参数中有 {err_msg: 'system:function_not_exist'}
    function invoke(eve, params, cb) {
      _check(function() {
        if (typeof params === 'function') {
          cb = params;
          params = {};
        }
        // 微信接口调用
        WeixinJSBridge.invoke(eve, params, function(res) {
          // 调用回调，可能包括：cancel，eve不存在，或者有返回内容的接口，如选取图片；所以不需要记录错误日志
          if (typeof cb === 'function') {
            //err_msg example
            //case 'send_app_msg:cancel'
            //case 'send_app_msg:fail'
            //case 'send_app_msg:confirm'
            //case 'send_app_msg:ok'
            var status = (res.err_msg.match(/^\w+:(\w+)/))[1];
            cb(status === 'ok' || status === 'confirm', status, res);
          }
        });
      });
    }

    // 监听 menu 事件
    function _listenMenu(key, func, cb) {
      if (!(key in listenEvents)) {
        return false;
      }

      var eve = listenEvents[key],

        invokeCallback = function(shareData) {
          if (!shareData) { return ; }

          // 复制 shareData，保证不要修改到源数据
          var k, data = {}, shareKey;
          for (k in shareData) { if (shareData.hasOwnProperty(k)) { data[k] = shareData[k]; }}
          shareData = {};

          shareKey = key.replace('shareTo', '').toLowerCase();

          function getShareValue(key, wechatKey) {
            return data[shareKey + key.charAt(0).toUpperCase() + key.substr(1)] ||
              data[key] || (wechatKey && data[wechatKey]) || '';
          }

          shareData.title = getShareValue('title');
          shareData.desc = getShareValue('desc');
          shareData.img_url = getShareValue('img', 'imgUrl');
          shareData.link = getShareValue('link');


          switch (shareKey) {
            case 'timeline':
              /*
               分享到朋友圈，微信需要的数据（驼峰化了，微信是下划线的形式）
               imgURL:    图片 url
               imgWidth:  图片宽度（不需要指定）
               imgHeight: 图片高度（不需要指定）
               link:       链接 url
               title:      标题
               */
              shareData.title = getShareValue('desc', 'title'); // 微信分享到朋友圈是用 title 字符，并不是 desc，这里做转化
              shareData.desc = shareData.title; // 微信android的一个bug: 缺少 desc 就无法分享，但 desc 根本没用
              break;
            case 'friend':
              /*
               分享到朋友，微信需要的数据（驼峰化了，微信是下划线的形式）
               appid:      好友微信的 appid，可以不指定，发送的时候再选择
               imgURL:    图片 url
               imgWidth:  图片宽度（不需要指定）
               imgHeight: 图片高度（不需要指定）
               link:       链接 url
               desc:       文字描述
               title:      标题
               */
              break;
            case 'email':
            case 'weibo':
              /*
               分享到微博，微信需要的数据（驼峰化了，微信是下划线的形式）
               content:    content 里面加以加上 url，微博会自动转换成可点的链接
               imgURL:
               imgWidth:
               imgHeight:
               */
              shareData.content = shareData.desc + ' ' + shareData.link;
              break;
          }

          invoke(eve[1], shareData, cb);
        };


      function getShareData() {
        var shareData = typeof func === 'function' ? func.call(null, invokeCallback, key) : func;
        if (Object.prototype.toString.call(shareData) === '[object Object]') {
          invokeCallback(shareData);
        }
      }

      // 非 email 消息不能直接 invoke，必须放到on_xxx之下，否则会报 "access_control:not_allow" 错误
      return eve[0] ? on(eve[0], getShareData) : getShareData();
    }

    var Wechat = {
      /*
         Wechat.call(function() {
            // 只有在微信下才会执行
         });
       */
      call           : _check,

      /*
       分享到朋友圈的数据: desc/img/link
       */
      shareToTimeline: function(params, cb) { _listenMenu('shareToTimeline', params, cb); },


      /*
       分享到好友的数据: title/desc/img/link  如果不设置 title，则为空字符串，保持和”分享到朋友圈的接口“一致
       */
      shareToFrient  : function(params, cb) { _listenMenu('shareToFrient', params, cb); },


      /*
       分享到腾讯微博的数据: desc/img/link（新版本微信不支持微博分享了）
       分享到微博可以在 desc 中加上 url，微博会将它转化成可点击的链接的，如果不加也可以指定 link，指定后 link 会自动加到 desc 的后面
       */
      //shareToWeibo   : function(params, cb) { _listenMenu('shareToWeibo', params, cb); },

      /*
        和微博分享参数一致
       */
      shareToEmail: function(params, cb) { _listenMenu('shareToFrient', params, cb); },

      /*
       统一分享的数据，加上相应的前缀，表示只在分享到这个平台才用这个参数
         title/friendTitle
         desc/friendDesc/timelineDesc/weiboDesc/emailDesc
         img/friendImg/timelineImg/weiboImg/emailImg
         link/friendLink/timelineLink/weiboLink/emailLink


       // 同步 获取分享数据
       Wechat.share(shareData)
       Wechat.share(function() { return shareData })

       // 异步 获取分享数据
       Wechat.share(function(callback) {
         ajax(...)
         .success() { callback( shareData }
         .error() { callback( shareData ) }

         // do not return anything
       })

       // 获取分享结果
       Wechat.share(shareData, function(status, text, res) {
         if (status) { alert('分享成功') }
         else { alert('分享失败（可能是用户取消分享）') }
       })
       */
      share: function(params, cb) {
        Wechat.shareToFrient(params, cb);
        Wechat.shareToTimeline(params, cb);
        // Wechat.shareToWeibo(params, cb);
        Wechat.shareToEmail(params, cb);
      },


      // 获取用户网络类型
      // wifi, edge(非wifi,包含2G/3G), fail(无网络), wwan(2G或者3G)
      getNetworkType : function(cb) {
        invoke('getNetworkType', {}, function(res) {
          var type = res.err_msg.split(':');
          if (type) {
            type = type[1];
          }
          if (cb) {
            cb(type);
          }
        });
      },

      // 关闭微信的 webview
      close          : function() { call('closeWindow'); },

      // 隐藏、显示 右上角选项按钮
      hideOptionMenu : function() { call('hideOptionMenu'); },
      showOptionMenu : function() { call('showOptionMenu'); },

      // 隐藏、显示底部 toolbar （微信已经没有这功能了）
      //hideToolbar    : function() { call('hideToolbar'); },
      //showToolbar    : function() { call('showToolbar'); },


      shareTip: function(opt) {
        var wrap = document.createElement('div');
        opt = opt || {};
        wrap.style.cssText = 'position: fixed;' +
        'left: 0;right: 0;top: 0;bottom: 0;' +
        'z-index: 99999;' +
        'background: rgba(0, 0, 0, .8) url("http://wechat-professor.qiniudn.com/wechat_top_right_share_arrow.png") ' +
        'no-repeat 95% 2%;' +
        'background-size: 100px 100px';
        wrap.innerHTML = '<p style="color:white;padding-top:110px;font-size:24px;text-align:center;line-height:38px">'+
        '请点击右上角<br/>再点击【分享到朋友圈】</p>';

        document.body.appendChild(wrap);

        setTimeout(function() {
          wrap.outerHTML = '';
        }, opt.timeout || 4000);
      }
    };


    return Wechat;
  });