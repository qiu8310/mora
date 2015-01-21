/*
 angular
 .module('vendors', [])

 // 用 constant 是为了使它可以用在 angular.config 中
 .constant('_', (function() {
 var _ = window._, $ = window.jQuery;


 (function registerAsyncClickToLoDash() {
 function isTextNode(el) {
 return $.trim(el.text()) && el.children().length === 0;
 }

 function findTextNode(el) {
 var find = null;
 if (isTextNode(el)) { return el; }

 el.children().each(function() {
 if (find) { return false; }

 var el = $(this);
 find = isTextNode(el) ? el : findTextNode(el);
 });

 return find;
 }

 _.mixin({asyncClickOn: function(element, fn, options) {
 options = options || {};
 element = $(element);

 var promise,
 textNode = findTextNode(element),
 originalText = textNode.text(),
 asyncText = options.asyncText || originalText + '...',
 asyncClass = options.asyncClass || 'disabled',
 asyncTarget = options.asyncTarget && $(options.asyncTarget);

 if (element.hasClass(asyncClass)) {
 return false;
 }
 if (options.asyncConfirm && !window.confirm(options.asyncConfirm)) {
 return false;
 }

 asyncClass += ' async-loading';
 asyncTarget = asyncTarget && asyncTarget.length ? asyncTarget.eq(0) : null;


 var spinElement;

 function start() {
 textNode.text(asyncText);
 element.addClass(asyncClass);
 if (asyncTarget) {
 spinElement = $('<div class="async-loading"><i class="fa fa-spinner fa-2x fa-spin"></i></div>');
 var style = {
 width: asyncTarget.width(),
 height: asyncTarget.height()
 };
 spinElement.css(style);
 spinElement.find('.fa').css({
 marginLeft: style.width / 2 - 8,
 marginTop: Math.min(style.height / 2 - 8, 100)
 });


 asyncTarget.fadeOut(300, function() {
 asyncTarget.before(spinElement);
 });
 }
 }

 function finish() {
 textNode.text(originalText);
 element.removeClass(asyncClass);
 if (asyncTarget) {
 spinElement.remove();
 spinElement = null;
 asyncTarget.fadeIn(500);
 }
 }


 element[0].blur();
 promise = fn.apply(options.context, options.args || []);

 // promise 结束时的回调
 var promiseFn = promise && (promise.always || promise.finally);
 if (typeof promiseFn === 'function') {
 start();
 promiseFn.call(promise, finish);
 }

 }});

 })();


 return _;
 })())
 */


/* jshint ignore:start */
var ng = angular;
/* jshint ignore:end */

(function() {

  function walkObj(obj, processFn, deep) {
    if (ng.isUndefined(deep)) {
      deep = true;
    }
    if (ng.isString(obj)) {
      return processFn(obj);
    } else {
      var result,
        isArray = ng.isArray(obj),
        isObject = ng.isObject(obj);
      if (isArray || isObject) {
        result = isArray ? [] : {};

        ng.forEach(obj, function(val, key) {
          if (isObject) {
            key = processFn(key);
          }

          result[key] = deep && (ng.isArray(val) || ng.isObject(val)) ?
            walkObj(val, deep, processFn) :
            val;
        });

        return result;
      }
    }
    return obj;
  }

  ng.element.prototype.find = function(selector) {
    return ng.element(this[0] ? this[0].querySelector(selector) : undefined);
  };

  ng.querySelector = function(selector, context) {
    return ng.element((context || document).querySelector(selector));
  };
  ng.querySelectorAll = function(selector, context) {
    return ng.element((context || document).querySelectorAll(selector));
  };
  ng.ignoreFirstCall = function(fn) {
    var cb;
    return function() {
      return cb ? cb.apply(null, arguments) : (cb = fn);
    };
  };
  ng.capitalize = function(str) {return str.charAt(0).toUpperCase() + str.substr(1);};
  ng.camelCase = function (obj, deep) {
    return walkObj(obj, function(str) {
      return str.replace(/_+([a-z])/g, function(_, letter) { return letter.toUpperCase(); });
    }, deep);
  };
  ng.lineCase = function(obj, deep) {
    return walkObj(obj, function(str) {
      // 如果第一个字符是大写的，则不要在它前面加中划线，直接小写就行了
      return str.replace(/[A-Z]/g, function(letter, index) { return (index ? '-' : '') + letter.toLowerCase(); });
    }, deep);
  };
  ng.snakeCase = function(obj, deep) {
    return walkObj(obj, function(str) {
      return str.replace(/[A-Z]/g, function(letter, index) { return (index ? '_' : '') + letter.toLowerCase(); });
    }, deep);
  };
  ng.buildQuery = function(query) {
    if (ng.isObject(query)) {
      var res = [];
      ng.forEach(query, function(val, key) {
        key = encodeURIComponent(key);
        val = encodeURIComponent(val);
        res.push(key + '=' + val);
      });
      query = res.join('&');
    }
    return query;
  };
  ng.appendQuery = function(url, query) {
    if (!query) { return url; }

    var parts = url.split('#'),
      hash = parts.length === 2 ? ('#' + parts[1]) : '';
    query = ng.buildQuery(query);

    return (parts[0] + '&' + query).replace(/[&?]{1,2}/, '?') + hash;
  };
  ng.parseQuery = function(urlOrQuery) {
    var search = urlOrQuery.split('#')[0].split('?'),
      result = {};

    var isUrl = /^\w+\:\/\/\w+/.test(urlOrQuery);
    search = !isUrl ? search[0] : search.length === 2 ? search[1] : '';

    search.replace(/([^&=]+)=([^&]*)/g, function (raw, key, val) {
      key = decodeURIComponent(key);
      val = decodeURIComponent(val);
      result[key] = val;
    });
    return result;
  };

  ng.toString = function(obj) { return Object.prototype.toString.call(obj); };
  ng.type = function(obj) { return ng.toString(obj).replace(/\[object (.+)\]/, '$1').toLowerCase(); };
  ng.toArray = function() {
    var args = [].slice.call(arguments);
    ng.forEach(args, function(arg, index) {
      if (['arguments'].indexOf(ng.type(arg)) >= 0) {
        args[index] = [].slice.call(arg);
      }
    });
    return [].concat.apply([], args);
  };


  ng.css3 = function(el, key, val) {
    var style, t, unDef;
    style = val === unDef ? window.getComputedStyle(el, null) : el.style;

    key = key.replace(/-[a-z]/g, function(r) { return r.charAt(1).toUpperCase(); });
    if (!(key in style)) {
      ['Webkit', 'O', 'Moz', 'ms'].forEach(function(prefix) {
        t = prefix + key.charAt(0).toUpperCase() + key.substr(1);
        if (t in style) { key = t; }
      });
    }
    return val === unDef ? style[key] : (style[key] = val);
  };
  ng.element.prototype.css3 = function(key, val) {
    for (var i = 0; i < this.length; i++) { ng.css3(this[i], key, val); }
  };


  ng.info = function(title, args) {
    try {
      if (arguments.length === 1) {
        title = 'default';
        args = [arguments[0]];
      } else {
        args = [].slice.call(arguments, 1);
      }
      args = [].concat('%c' + ng.capitalize(title) + ':  ', 'color:green;font-weight:700;', args);
      console.info.apply(console, args);
    } catch(e) {}
  };

})();