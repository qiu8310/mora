/* global LLSAndroid */

angular.module('mora.ui')
  .factory('Native', function (Env) {

    function loadFrame(url) {
      var doc = Env.doc,
        body  = doc.getElementsByTagName('body')[0],
        frame = doc.createElement('iframe');
      frame.frameborder = 0;
      frame.style.display = 'none';
      body.appendChild(frame);
      frame.onload = function() {
        frame.parentNode.removeChild(frame);
        frame.onload = null;
      };
      frame.src = url;
    }

    var C = Env.C;

    var Native = {
      // https://git.llsapp.com/docs/engzo-api-doc/wikis/webview-and-native
      // url => '', content => '', channels => ["wx_friend", "wx_timeline", "wb", "qz"]
      share: function(opt) {
        //var params = {
        //  url: link,
        //  content: msg,
        //  img: img,
        //  channels: channels
        //};
        window.location.href = 'lls://share/' + encodeURIComponent(JSON.stringify(opt));
      },

      back: function() {
        window.location.href = 'lls://back';
      },

      addModule: function(moduleId) {
        window.location.href = 'lls://module/' + moduleId + '/add';
      },

      // 从其它浏览器里调起 APP，并打开首页
      // 1. a href="http://www.liulishuo.com/download"
      // 2. ios 要监听 a click 并 preventDefault， android 则不能 preventDefault
      getLLSApp: function() {
        if (Env.Platform.isWechat) {
          location.href = C.app.download.wechat;
        } else {
          var startTime = Date.now();
          loadFrame('lls://home');

          setTimeout(function() {
            if (Date.now() - startTime < 1000) {
              location.href = Env.downloadUrl;
            }
          }, 400);
        }


      }
    };


    // 新接口
    var callbackIndex = 10000;
    function storeCallback(callback) {
      callbackIndex += 1;
      var key = '_cb_' + callbackIndex;
      window[key] = function() {
        var args = [].slice.call(arguments);
        Env.L.log('exec ' + key + ' ', args);
        callback.apply(window, args);
        delete window[key];
        return 'yes';
      };
      return key;
    }

    var androidSupportEvents = ['uploadImage', 'uploadVoice', 'nativeBack', 'nativeMinimize', 'playVideo'],
      iosSupportEvents = ['uploadImage', 'uploadVoice'];

    Native.invoke = function(event, callback, paramsArray) {
      if (!Env.Platform.isLLS) { return false; }
      /*
       // 安卓上 WebView 与 Native 通信
       LLSAndroid.invoke('uploadImage',    callback);
       LLSAndroid.invoke('uploadVoice',    callback, allowRecordSeconds);
       LLSAndroid.invoke('nativeBack',     callback);
       LLSAndroid.invoke('nativeMinimize', callback);
       LLSAndroid.invoke('playVideo', callback, videoSrc);


       // iOS 上 WebView 与 Native 通信
       lls://uploadImage/callback
       lls://uploadVoice/callback/allowRecordSeconds
       */

      var callbackKey = storeCallback(callback),
        parts = [event, callbackKey];

      if (event === 'uploadVoice') {
        if (!paramsArray) {
          paramsArray = [0]; // 默认上传音频没有限时
        }
      } else if (event === 'playVideo') {
        if (!paramsArray || paramsArray.length === 0) {
          throw new Error('playVideo should provide video src');
        }
      }

      if (paramsArray && !Array.isArray(paramsArray)) {
        paramsArray = [paramsArray];
      }

      ng.forEach(paramsArray, function(param) {
        parts.push(param + '');
      });

      try {
        if (Env.Mobile.isIOS && iosSupportEvents.indexOf(event) >= 0) {
          var urlScheme = 'lls://' + parts.join('/');
          Env.L.log('ios invoke ' + urlScheme);
          loadFrame(urlScheme);

        } else if (Env.Mobile.isAndroid && androidSupportEvents.indexOf(event) >= 0) {
          Env.L.log('android invoke ' + parts.join(','));
          if (parts.length === 2) {
            LLSAndroid.invoke(parts[0], parts[1]);
          } else if (parts.length === 3) {
            LLSAndroid.invoke(parts[0], parts[1], parts[2]);
          }
        }
      } catch (e) { Env.L.error('Native invoke error', e); }

    };


    return Native;

  });
