angular.module('moraApp').service('Env', function () {

  var Env = this,
    host = location.host,
    params = {};


  location.search.slice(1).replace(/([^&=]+)=([^&]*)/g, function ($, key, val) {
    key = decodeURIComponent(key);
    val = decodeURIComponent(val);
    params[key] = val;
  });

  Env.Params = params;


  Env.isStaging = params.env === 'staging' || host.indexOf('staging') >= 0 || host.indexOf('qiniudn.com') > 0;

  // localhost 可能会带有端口号，所以不能用全等，也可能是本地文件，即 host === ''
  Env.isLocal = params.env === 'local' ||
    !host || host.indexOf('localhost') === 0 || ['192', '172', '127'].indexOf(host.split('.').shift()) > -1;

  Env.isOnline = params.env === 'online' || !Env.isLocal && !Env.isStaging;

  Env.isTest = Env.isStaging || Env.isLocal;



  /**
   * Mobile
   * Platform
   */
  var Mobile = {},
    Platform = {},
    agent = navigator.userAgent;

  // http://www.abeautifulsite.net/detecting-mobile-devices-with-javascript/
  Mobile.isIOS = /iP(ad|hone|od)/.test(agent);
  Mobile.isAndroid = /Android/i.test(agent);
  Mobile.isAny = Mobile.isIOS || Mobile.isAndroid || /BlackBerry|Opera Mini|IEMobile/i.test(agent);

  Platform.isWechat = /MicroMessenger/i.test(agent) || params.wechat;
  Platform.isQQ = /\bQQ\b/.test(agent);
  Platform.isWeibo = /\bWeibo\b/i.test(agent);


  Env.Mobile = Mobile;
  Env.Platform = Platform;

});