angular.module('moraApp')
  .factory('Wechat', function() {

    /* global WeixinJSBridge */
    /*jshint camelcase: false */
    /*
     wechat.call(function() {
     // 只有在微信下才会执行
     });


     // 同步 获取分享数据
     wechat.share(function() {
     var data = utils.objectifyForm(document.wechat_professor),
     return {
     title: data.title,
     desc: data.desc,
     imgURL: data.imgURL,
     link: data.link
     }
     });


     // 异步 获取分享数据
     wechat.share(function(callback) {
     var data = utils.objectifyForm(document.wechat_professor),
     shareData = {
     title: data.title,
     desc: data.desc,
     imgURL: data.imgURL,
     link: data.link
     };

     ajax({
     url: DATA.data_uploader_url,
     type: 'POST',
     dataType: 'text',
     data: data,
     success: function(id) {
     if (id.length > 1) {
     shareData.link = DATA.share_url + id;
     }
     callback(shareData);
     },
     error: function() {
     callback(shareData);
     }
     });

     }, function(status, text, res) {
     Debug[status ? 'success' : 'error'](text, res);
     });
     */
    'use strict';


    // WeixinJSBridgeReady 事件肯定触发完 微信相关操作才有效
    var listenEvents = {
        'shareToFrient'  : ['menu:share:appmessage', 'sendAppMessage'],
        'shareToTimeline': ['menu:share:timeline', 'shareTimeline'],
        'shareToWeibo'   : ['menu:share:weibo', 'shareWeibo']
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
      if (!(key in listenEvents) || (typeof func !== 'function')) {
        return false;
      }


      var eve = listenEvents[key],

        invokeCallback = function(shareData) {
          if (!shareData) {
            return ;
          }

          // copy data
          var k, data = {};
          for (k in shareData) { if (shareData.hasOwnProperty(k)) { data[k] = shareData[k]; }}
          shareData = data;

          if (key === 'shareToTimeline') {
            if (shareData.timelineDesc) {
              shareData.desc = shareData.timelineDesc;
            }

            // 处理 wechat android bug: 缺少 desc 就无法分享，但 desc 根本没用
            if (!shareData.desc) {
              shareData.desc = shareData.title;

              // 如果有 desc，则把 title 换成 desc，毕竟 desc 全面一些
            } else {
              shareData.title = shareData.desc;
            }


          } else if (key === 'shareToFriend') {
            if (shareData.friendDesc) {
              shareData.desc = shareData.friendDesc;
            }

          } else if (key === 'shareToWeibo') {
            if (!shareData.content) {
              shareData.content = shareData.desc;
            }
          }

          // 统一将命名转成驼峰式
          [
            ['img_url', 'imgURL'],
            ['img_width', 'imgWidth'],
            ['img_height', 'imgHeight']

          ].forEach(function(it) {
              if (shareData[it[1]]) {
                shareData[it[0]] = shareData[it[1]];
                delete shareData[it[1]];
              }
            });

          invoke(eve[1], shareData, cb);
        };

      on(eve[0], function() {
        // 消息不能直接 invoke，必须放到on_xxx之下，否则会报 "access_control:not_allow" 错误
        var shareData = func.call(null, invokeCallback, key);
        invokeCallback(shareData);
      });
    }

    var wechat = {
      call           : _check,

      /*
       # 发送图文消息给好友

       # paramsFunc should return

       appid:      好友微信的 appid，可以不指定，发送的时候再选择
       imgURL:    图片 url
       imgWidth:  图片宽度（不需要指定）
       imgHeight: 图片高度（不需要指定）
       link:       链接 url
       desc:       文字描述
       title:      标题
       */
      shareToFrient  : function(paramsFunc, cb) {
        _listenMenu('shareToFrient', paramsFunc, cb);
      },

      /*
       # 分享到朋友圈

       # paramsFunc should return

       imgURL:    图片 url
       imgWidth:  图片宽度（不需要指定）
       imgHeight: 图片高度（不需要指定）
       link:       链接 url
       title:      标题

       wechat android bug: 安卓一定要带上 desc 这个字段，但它没用，你可以将它设置成和 title 一样

       比发送给好友的接口少一个 desc 和 appid
       */
      shareToTimeline: function(paramsFunc, cb) {
        _listenMenu('shareToTimeline', paramsFunc, cb);
      },

      /*
       # 分享到腾讯微博

       # paramsFunc should return

       content:    content 里面加以加上 url，微博会自动转换成可点的链接
       imgURL:
       imgWidth:
       imgHeight:
       */
      shareToWeibo   : function(paramsFunc, cb) {
        _listenMenu('shareToWeibo', paramsFunc, cb);
      },

      /**
       * 能用接口
       *
       * paramsFunc should return
       *
       *  title:
       *  desc:
       *  imgURL:
       *  link:
       *
       */
      share: function(paramsFunc, cb) {
        wechat.shareToFrient(paramsFunc, cb);
        wechat.shareToTimeline(paramsFunc, cb);
        wechat.shareToWeibo(paramsFunc, cb);
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

      // 隐藏、显示底部 toolbar
      hideToolbar    : function() { call('hideToolbar'); },
      showToolbar    : function() { call('showToolbar'); },


      shareTip: function(opt) {
        var wrap = document.createElement('div');
        opt = opt || {};
        wrap.style.cssText = 'position: fixed;' +
        'left: 0;right: 0;top: 0;bottom: 0;' +
        'z-index: 99999;' +
        'background: rgba(0, 0, 0, .8) url("http://wechat-professor.qiniudn.com/wechat_top_right_share_arrow.png") no-repeat 95% 2%;' +
        'background-size: 100px 100px';
        wrap.innerHTML = '<p style="color:white;padding-top:110px;font-size:24px;text-align:center;line-height:38px;">请点击右上角<br/>再点击【分享到朋友圈】</p>';

        document.body.appendChild(wrap);

        setTimeout(function() {
          wrap.outerHTML = '';
        }, opt.timeout || 4000);
      }
    };


    return wechat;

  });