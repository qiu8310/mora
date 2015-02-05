/*
 Test resource
 images:
 美女： http://lesson-production.qiniudn.com/connett/dbf9181e-4320-4bf0-8059-41dd56887476?imageView2/2/w/216/h/135
 女头像1：http://lesson-production.qiniudn.com/connett/ef1d9340-0ddc-451f-b5cc-81e663af910f
 女头像2：http://lesson-production.qiniudn.com/connett/24771d44-259d-492a-8786-f1cdd21e68de
 男头像1：http://lesson-production.qiniudn.com/connett/8a1b42af-8fc5-4c43-aacb-20dd8cf62ac3
 男头像2：http://lesson-production.qiniudn.com/connett/b9ce1c9a-18cf-4c5f-b8fc-e692dcba54a8

 audio:
 http://lesson-production.qiniudn.com/connett/b24c13cd-7133-4206-8e01-7d1d0e5eeafd

 video:
 http://lesson-production.qiniudn.com/connett/3d0cc95e-c9c7-4a5b-9b6f-7f9b38458095

 */
angular.module('mora.ui')
  .constant('C', (function() {

    var C = {
      app: {
        set: function(appName, options) {

          // http://staging-neo.llsapp.com/neo_huodong/api/huodongs/1/view/spring/b/c

          var pathname = window.location.pathname,
            pathParts = pathname.split('/'),
            basePath = '', index, id = 0;
          index = pathParts.indexOf(appName);


          if (index > 0) {
            basePath = pathParts.slice(0, index + 1).join('/');
            if (/\/(\d+)\//.test(basePath)) { id = parseInt(RegExp.$1, 10); }
          } else {
            // 如果没有 path，则使用非 html5 模式
            C.app.html5Mode = false;
            basePath = '/' + appName;
            if (/\/(\d+)$/.test(pathname)) { id = parseInt(RegExp.$1, 10); }
          }

          if (!id && /\bid=(\d+)\b/.test(window.location.search)) {id = parseInt(RegExp.$1, 10); }

          C.app.id = id;
          C.app.name = appName;
          C.app.basePath = basePath;
          C.app.mainPage = basePath;

          ng.forEach(options || {}, function(val, key) {C.app[key] = val; });
        },

        html5Mode: true,
        hashPrefix: '!',

        // console.x(..., 'verbose:', ...)
        // 如果 logVerbose 为 false，则 verbose 之后的数据是不会显示的
        logVerbose: false,


        // 单独配置在 app.js 的 config 中
        // allowAccessFrom: ['wechat'],  // qq, weibo, wechat, alipay, lls, all

        download: {
          android: 'http://www.liulishuo.com/android',
          ios: 'http://www.liulishuo.com/ios',
          iosOrigin: 'https://itunes.apple.com/us/app/liu-li-shuo-hui-da-fen-zhi/id597364850?ls=1&mt=8',
          wechat: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.liulishuo.engzo&g_f=991653',
          other: 'http://www.liulishuo.com'
        }
      },

      res: {
        proxyUrl: 'http://mora.sinaapp.com/utils/proxy.php',
        uploaderUrl: 'http://mora.sinaapp.com/utils/uploader.php'
      }
    };

    return C;

  })());
