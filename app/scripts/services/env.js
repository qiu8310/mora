angular.module('mora.ui').service('Env', function (C, Storage, $window, $location) {

  var win = $window,
    doc = win.document,
    Env = this,
    location = win.location,
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
   * 包括移动端(Env.L) 和 电脑端(console)
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

  var _log = function(elem, msg, append) {
    if (append || append === undefined) {
      msg = elem.textContent + '\r\n' + msg;
    }
    elem.textContent = msg;
  };
  var wrap = function(key) {
    return function() {
      if (!query.__DEBUG) { return false; }

      var container = doc.querySelector('.__debug'),
        holder = doc.querySelector('.__debug .holder'),
        toggle = doc.querySelector('.__debug .toggle');
      if (!container) {
        container = doc.createElement('div');
        container.className = '__debug toggle-visible';
        (doc.getElementById('root') || doc.body).appendChild(container);
      }
      if (!toggle) {
        container.innerHTML = '';
        toggle = doc.createElement('a');
        toggle.textContent = 'Toggle Visible';
        toggle.className = 'toggle';

        holder = document.createElement('div');
        holder.className = 'holder';

        container.appendChild(toggle);
        container.appendChild(holder);
        toggle.onclick = function() { container.classList.toggle('toggle-visible'); };
      }


      var elem = doc.createElement('div');
      elem.className = key;
      holder.appendChild(elem);

      var args = [].slice.call(arguments, 0);
      var msg = [], append = true;

      if (typeof args[args.length - 1] === 'boolean') {
        append = args.pop();
      }

      args.forEach(function(arg) {
        if (typeof arg === 'object') {
          try {
            arg = JSON.stringify(arg);
          } catch (e) { arg = arg.toString(); }
        }
        msg.push(arg);
      });

      _log(elem, msg.join(', '), append);
    };
  };

  var L = {};
  ng.forEach('log info error debug'.split(' '), function(key) {
    if (DEBUG && (DEBUG === 'all' || DEBUG === key)) {
      console['_' + key] = console[key]; // backup old method
      console[key] = debug(console[key]);
      L[key] = wrap(key);
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


  var allPlatform = {Wechat: '微信', QQ: 'QQ', Weibo: '新浪微博', Alipay: '支持宝', LLS: '流利说'};

  Platform.isWechat = /MicroMessenger/i.test(agent) || query.wechat;
  Platform.isQQ = /\bQQ\b/.test(agent);
  Platform.isWeibo = /\bWeibo\b/i.test(agent);
  Platform.isAlipay = /AlipayClient/i.test(agent) || query.alipay;
  Platform.isLLS = query.token && query.token.length > 10;

  // 访问平台限制
  var allowAccessFrom = [].concat(C.app.allowAccessFrom || []);
  if (!Env.isLocal && allowAccessFrom.length > 0 && allowAccessFrom.indexOf('all') === -1) {
    var _all = {}, _allows = [], _hit = false, _item;

    Object.keys(allPlatform).forEach(function(key) {
      _all[key.toLowerCase()] = {label: allPlatform[key], id: 'is' + key};
    });

    allowAccessFrom.forEach(function(key) {
      _item = _all[key.toLowerCase()];
      _allows.push(_item.label);
      if (Platform[_item.id]) { _hit = true; }
    });

    if (!_hit) {
      $window.alert('请在【' + _allows.join('】或【') + '】APP内访问');
    }
  }


  // 平台相关的下载地址
  var downloads = C.app.download;
  Object.keys(allPlatform).forEach(function(key) {
    if (Platform['is' + key]) {
      key = key.toLowerCase();
      if (key in downloads) { Env.downloadUrl = downloads[key]; }
    }
  });
  if (!Env.downloadUrl) {
    Env.downloadUrl = Mobile.isIOS ? downloads.ios : Mobile.isAndroid ? downloads.android : downloads.other;
  }

  Env.Mobile = Mobile;
  Env.Platform = Platform;


  // 流利说相关数据
  var LLSDeviceInfo = {};
  if (Platform.isLLS) {
    LLSDeviceInfo = {
      token: query.token,
      version: query.version || 'events', // 版本号, 要么是v6，要么是老版本的events, v6版的app和之前的 token 不兼容
      appId: query.appId,
      sDeviceId: query.sDeviceId,
      deviceId: query.deviceId,
      appVersion: query.appVersion  // 在做 上传图片、上传音频、播放视频时新加的一个参数，所以用它可以来判断支不支持这些功能
    };
  }

  // 提供给 android 主 APP，方便它打点
  doc.cookie = 'activity_id=' + C.app.id + ';path=/';
  Env.LLSDeviceInfo = LLSDeviceInfo;


  // 微信下 screen.height = 568,  clientHeight = 504
  Env.Browser = {
    fullHeight: win.screen.height - doc.documentElement.clientHeight <= 20
  };

  win.G = ng.camelCase(win.G || {});

  // 设置其它变量，避免每次要用都用注入的方法
  Env.win = win;
  Env.doc = doc;
  Env.now = function() { return Date.now(); };
  Env.QUERY = query;
  Env.Storage = Storage;
  Env.C = C;
  Env.L = L;
  Env.G = win.G; // 全局变量，可以是后台传给页面上的

  var basePath = C.app.basePath;
  Env.path = function(url) { $location.path( basePath + url ); };

  win.Env = Env;
});