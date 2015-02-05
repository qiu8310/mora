
/* jshint ignore:start */
var ng = angular;
/* jshint ignore:end */


(function registerAsyncClick() {

  function isTextNode(el) {
    return el.textContent.trim() && el.children.length === 0;
  }

  function findTextNode(el) {
    var find = null;
    if (isTextNode(el)) { return el; }

    [].slice.call(el.children).forEach(function(it) {
      if (find) { return false; }
      find = isTextNode(it) ? it : findTextNode(it);
    });

    return find;
  }

  /**
   * @param el
   * @param fn
   * @param options {object}  text, confirm, style, loadingStyle, context, args, target [ 暂不支持 target ]
   *
   * @returns {boolean}
   */
  function asyncClick(el, fn, options) {
    options = options || {};

    if (!el.nodeType) { el = el[0]; }

    var promise,
      textNode = findTextNode(el) || {},
      originalText = textNode.textContent,

      text = options.text || originalText + '...',
      confirm = options.confirm,
      style = options.style || 'disabled',
      loadingStyle = options.loadingStyle || 'async-loading';

    //var target = options.target && options.target.nodeName ? options.target : null;

    if (el.classList.contains(style) || confirm && !window.confirm(confirm)) {
      return false;
    }



    //var spinElement;

    function start() {
      textNode.textContent = text;
      el.classList.add(style);
      el.classList.add(loadingStyle);

      //if (target) {
        //spinElement = $('<div class="async-loading"><i class="fa fa-spinner fa-2x fa-spin"></i></div>');
        //var style = {
        //  width: asyncTarget.width(),
        //  height: asyncTarget.height()
        //};
        //spinElement.css(style);
        //spinElement.find('.fa').css({
        //  marginLeft: style.width / 2 - 8,
        //  marginTop: Math.min(style.height / 2 - 8, 100)
        //});
        //
        //
        //asyncTarget.fadeOut(300, function() {
        //  asyncTarget.before(spinElement);
        //});
      //}
    }

    function finish() {
      textNode.textContent = originalText;
      el.classList.remove(style);
      el.classList.remove(loadingStyle);

      //if (target) {
        //spinElement.remove();
        //spinElement = null;
        //asyncTarget.fadeIn(500);
      //}
    }


    el.blur();


    var async = false,
      context = {
        async: function(flag) { async = flag !== false; },
        done: function() { async = false; finish(); }
      };
    promise = fn.apply(context, options.args || []);

    // promise 结束时的回调
    var promiseFn = promise && (promise.always || promise.finally);
    if (typeof promiseFn === 'function') {
      start();
      promiseFn.call(promise, finish);
    } else if (async) {
      start();
    }

  }

  ng.asyncClick = asyncClick;
  ng.element.prototype.asyncClick = function(fn, options) {
    for (var i = 0; i < this.length; i++) { asyncClick(this[i], fn, options); }
  };

})();


(function() {
  ng.isPlainObject = function(obj) {
    return ({}).toString.call(obj) === '[object Object]';
  };

  function walkObj(obj, processFn, deep) {
    if (ng.isUndefined(deep)) {
      deep = true;
    }
    if (ng.isString(obj)) {
      return processFn(obj);
    } else {
      var result,
        isArray = ng.isArray(obj),
        isObject = ng.isPlainObject(obj);
      if (isArray || isObject) {
        result = isArray ? [] : {};

        ng.forEach(obj, function(val, key) {
          if (isObject) {
            key = processFn(key);
          }

          result[key] = deep && (ng.isArray(val) || ng.isPlainObject(val)) ?
            walkObj(val, processFn, deep) :
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
  ng.find = function(arr, identity) {
    var i, item, res, key, flag;
    switch (ng.type(identity)) {
      case 'string':
        for (i = 0; i < arr.length; i++) { if (arr[i] && arr[i][identity]) { break; } } break;
      case 'function':
        for (i = 0; i < arr.length; i++) { if (identity(arr[i], i, arr)) { break; } } break;
      case 'object':
        for (i = 0; i < arr.length; i++) {
          item = arr[i];
          flag = true;
          for (key in identity) {
            if (identity.hasOwnProperty(key) && identity[key] !== item[key]) {
              flag = false;
              break;
            }
          }
          if (flag) { break; }
        }
        break;
      default:
        return res;
    }
    return arr[i];

  };
  ng.random = function() {
    var args = [].slice.call(arguments);
    if (ng.type(args[0]) === 'array') {
      var arr = args[0], len = arr.length;
      return len ? arr[ng.random(0, len - 1)] : null;
    } else {
      var min = 0, max;
      if (args.length === 1) { max = args[0]; }
      else { min = args[0]; max = args[1]; }
      return min + Math.floor(Math.random() * (max - min + 1));
    }
  };

  ng.css3 = function(el, key, val) {
    if (!el) { return false; }
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
  ng.translate = function(elem, transform, speed, func) {
    if (!elem) { return false; }
    transform = transform || {};

    var pos = (transform.x || 0) + 'px, ' + (transform.y || 0) + 'px';
    var scale = ('scale' in transform) ? transform.scale : 1;

    func = func || 'ease';
    ng.css3(elem, 'transitionTimingFunction', speed > 0 ? func : 'no');
    ng.css3(elem, 'transitionDuration', (speed || 0) + 'ms');
    ng.css3(elem, 'transform', 'translate('+ pos +') scale('+ scale +')');
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