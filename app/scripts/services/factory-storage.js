'use strict';

angular.module('moraApp')
  .factory('Storage', function () {
    // https://github.com/marcuswestin/store.js 支持跨域
    var Storage = window.localStorage,
      STORAGE_PREFIX = '_v1_';

    function call(fn) {
      if (Storage) {
        return fn.call(Storage);
      }
    }


    function set(key, val, millisecond) {
      call(function() {
        var deadTimestamp = millisecond ? Date.now() + millisecond : 0;
        this[STORAGE_PREFIX + key] = JSON.stringify([val, deadTimestamp]);
      });
      return val;
    }

    /*
     获取 key 对应的值，如果没有就执行 cb (不支持异步)
     */
    function get(key, cb) {
      return call(function() {
        var now = Date.now(),
          storageKey = STORAGE_PREFIX + key,
          item;

        try {
          item = JSON.parse(this[storageKey]);
        } catch(e) {}

        if (!item || item.length !== 2 || item[1] && now > item[1]) {
          var result;

          if (typeof cb === 'function') {
            result = cb();
            this.setItem(storageKey, result);
          } else {
            this.removeItem(storageKey);
          }

          return result;
        }

        return item[0];
      });
    }

    /*
     删除 key 对应的值
     */
    function del(key) {
      call(function() {
        this.removeItem(STORAGE_PREFIX + key);
      });
    }

    /*
     all/self/other
     */
    function empty(type) {
      call(function() {
        var key, isSelfKey;
        for (key in this) {
          isSelfKey = key.indexOf(STORAGE_PREFIX) === 0;
          if (!(type === 'self' && !isSelfKey || type === 'other' && isSelfKey)) {
            this.removeItem(key);
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
