angular.module('cheApp').service('Env', function (C, Storage, $window) {

  var doc = $window.document,
    Env = this,
    host = location.host,
    params;


  Env.isStaging = host.indexOf('staging') >= 0 || host.indexOf('qiniudn.com') >= 0 || host.indexOf('test') >= 0;

  // localhost 可能会带有端口号，所以不能用全等，也可能是本地文件，即 host === ''
  Env.isLocal = !host || host.indexOf('localhost') === 0 || ['192', '172', '127'].indexOf(host.split('.').shift()) > -1;
  Env.isOnline = !Env.isLocal && !Env.isStaging;
  Env.isTest = Env.isStaging || Env.isLocal;


  params = ng.parseQuery(location.href);
  Env.Params = params;
  if (params.userId) {
    Storage.set('userId', params.userId);
  }
  Env.getUserId = function() {
    return params.userId || Storage.get('userId') || (Env.isTest ? 'alipay_12345' : 'browser_' + Date.now());
  };

  /**
   * Debug
   */
  // 判断 DEBUG 与否
  var DEBUG = Env.Params.DEBUG || (Env.isTest ? 'all' : false),
    DEBUG_VERBOSE = Env.Params.DEBUG_VERBOSE || C.app.logVerbose,
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

  Platform.isWechat = /MicroMessenger/i.test(agent) || params.wechat;
  Platform.isQQ = /\bQQ\b/.test(agent);
  Platform.isWeibo = /\bWeibo\b/i.test(agent);
  Platform.isAlipay = /AlipayClient/i.test(agent) || params.alipay;


  Env.Mobile = Mobile;
  Env.Platform = Platform;


  Env.now = function() { return Date.now(); };


  Env.setCurrentCity = function(city) {
    Env.cityId = city.id;
    Env.cityName = city.name;
    return Storage.set('activeCity', {id: city.id, name: city.name}, true);
  };
  Env.getCurrentCity = function() { return Storage.get('activeCity'); };

  var currentCity = Env.getCurrentCity();
  Env.cityId = currentCity && currentCity.id;
  Env.cityName = currentCity && currentCity.name;

});