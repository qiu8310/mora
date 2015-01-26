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
  .constant('C', {
    app: {
      html5Mode: false,
      hashPrefix: '!',

      // console.x(..., 'verbose:', ...)
      // 如果 logVerbose 为 false，则 verbose 之后的数据是不会显示的
      logVerbose: false,


      allowAccessFrom: ['wechat'],  // qq, weibo, wechat, alipay, lls, all


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
  });
