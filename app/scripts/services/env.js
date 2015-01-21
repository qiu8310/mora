angular.module('mora.ui').service('Env', function (C, Storage, $window) {

  var doc = $window.document,
    Env = this,
    host = location.host,
    query;


  // clouddn.com, qiniudn.com, test, staging
  Env.isStaging = /(?:clouddn\.com|qiniudn\.com|test|staging)/.test(host);

  // localhost 可能会带有端口号，所以不能用全等，也可能是本地文件，即 host === ''
  Env.isLocal = !host || /^(?:localhost|192\.|172\.|127\.|0\.0\.0\.0)/.test(host);
  Env.isOnline = !Env.isLocal && !Env.isStaging;
  Env.isTest = Env.isStaging || Env.isLocal;


  query = ng.parseQuery(location.href);


  /**
   * Debug
   */
  // 判断 DEBUG 与否
  var DEBUG = query.DEBUG || (Env.isTest ? 'all' : false),
    DEBUG_VERBOSE = query.DEBUG_VERBOSE || C.app.logVerbose,
    nope = function() {},
    debug = function(fn) {
      return function() {
        var args = [], verbose;
        ng.forEach(ng.toArray(arguments), function(arg) {
          if (arg === 'verbose:') { verbose = true; return true; }
          if (!DEBUG_VERBOSE && verbose) { return false; }
          args.push(arg);
        });
        fn.apply(console, args);
      };
    };

  ng.forEach('log info error debug'.split(' '), function(key) {
    if (DEBUG && (DEBUG === 'all' || DEBUG === key)) {
      console['_' + key] = console[key]; // backup old method
      console[key] = debug(console[key]);
    } else {
      console[key] = nope;
    }
  });

  Env.DEBUG = DEBUG;
  Env.DEBUG_VERBOSE = DEBUG_VERBOSE;


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

  Platform.isWechat = /MicroMessenger/i.test(agent) || query.wechat;
  Platform.isQQ = /\bQQ\b/.test(agent);
  Platform.isWeibo = /\bWeibo\b/i.test(agent);
  Platform.isAlipay = /AlipayClient/i.test(agent) || query.alipay;


  Env.Mobile = Mobile;
  Env.Platform = Platform;


  // 设置其它变量，避免每次要用都用注入的方法
  Env.win = $window;
  Env.doc = doc;
  Env.now = function() { return Date.now(); };
  Env.QUERY = query;
  Env.Storage = Storage;
  Env.C = C;
  Env.G = $window.G || {}; // 全局变量，可以是后台传给页面上的

});