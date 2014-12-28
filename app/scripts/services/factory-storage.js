
angular.module('cheApp')
  .factory('Storage', function () {
    // https://github.com/marcuswestin/store.js 支持跨域
    var Storage = window.localStorage,
      CACHE = {},
      STORAGE_PREFIX = 'che_v1_';

    function call(fn) {
      if (Storage) {
        return fn.call(Storage);
      }
    }


    function set(key, val, millisecond, cache) {
      if (typeof millisecond === 'boolean') {
        cache = millisecond;
        millisecond = 0;
      }

      var storageKey = STORAGE_PREFIX + key,
        storageVal = [val, Date.now(), millisecond > 0 ? millisecond : 0];

      if (cache) { CACHE[storageKey] = storageVal; }

      call(function() {
        this[storageKey] = JSON.stringify(storageVal);
      });
      return val;
    }

    /*
     获取 key 对应的值，如果没有就执行 fallback (不支持异步)
     */
    function get(key, fallback) {
      return call(function() {
        var storageKey = STORAGE_PREFIX + key,
          storageVal;

        try {
          storageVal = CACHE[storageKey] || JSON.parse(this[storageKey]);
        } catch(e) {}

        var invalid = !storageVal || storageVal.length !== 3,
          expired = !invalid && storageVal[2] !== 0 && Date.now() > storageVal[1] + storageVal[2];

        if (invalid || expired) {
          var result = null,
            cached = storageKey in CACHE;

          switch (typeof fallback) {
            case 'undefined':
              del(key); break;
            case 'function':
              result = fallback();
              set(key, result, expired ? storageVal[2] : 0, cached);
              break;
            default :
              result = fallback;
              set(key, result, expired ? storageVal[2] : 0, cached);
              break;
          }
          return result;
        }

        return storageVal[0];
      });
    }

    /*
     删除 key 对应的值
     */
    function del(key) {
      var storageKey = STORAGE_PREFIX + key;
      delete CACHE[storageKey];
      call(function() {
        this.removeItem(storageKey);
      });
      return true;
    }

    /*
     all/self/other
     */
    function empty(type) {
      call(function() {
        var key, isSelfKey;
        for (key in this) {
          if (this.hasOwnProperty(key)) {
            isSelfKey = key.indexOf(STORAGE_PREFIX) === 0;
            if (!(type === 'self' && !isSelfKey || type === 'other' && isSelfKey)) {
              delete CACHE[key];
              this.removeItem(key);
            }
          }
        }
      });
    }

    // Public API here
    return {
      supported: !!Storage,
      set: set,
      get: get,
      del: del,
      empty: empty
    };
  });
