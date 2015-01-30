angular.module('mora.ui')
  .factory('Asset', function(http) {

    // http://www.html5rocks.com/en/tutorials/games/assetmanager/
    /*
     queue up downloads
     start downloads
     track success and failure
     signal when everything is done
     easy retrieval of assets
     */

    var nope = function() {};

    function Manager() {
      this.queue = [];  // { type, path, options,  target, status, data }
      this.successCount = 0;
      this.errorCount = 0;
      this.cache = {};  // type|path: queueItem
    }

    var Loader = {
      image: function(item, success, error) {
        var handler = function(e) {
          this.removeEventListener('load', handler, false);
          this.removeEventListener('error', handler, false);

          var fn = e.type === 'load' ? success : error;

          fn(item);
        };

        var img = new Image();
        img.addEventListener('load', handler, false);
        img.addEventListener('error', handler, false);
        img.src = item.path;

        return img;
      },
      http: function(item, success, error) {
        var options = item.options,
          method = options.method || 'get';
        return http[method](item.path, options)
          .success(function(data) {
            success(item, data);
          })
          .error(function(err) {
            error(item, err);
          });
      }
    };

    Manager.prototype = {
      each: function(cb) {
        for (var i = 0; i < this.queue.length; i++) {
          cb.call(this, this.queue[i], i, this.queue);
        }
      },
      add: function(type, paths, options) {
        var self = this;
        [].concat(paths).forEach(function(path) {
          self.queue.push({type: type, path: path, options: options || {}});
        });
        return this;
      },
      get: function(type, path) {
        return this.cache[type + '|' + path];
      },
      getErrors: function() {
        var result = [];
        this.each(function(item) {
          if (item.status === 'error') { result.push(item); }
        });
        return result;
      },
      isDone: function() {
        return this.queue.length === this.successCount + this.errorCount;
      },
      downloadAll: function(cb) {
        var self = this;
        cb = typeof cb === 'function' ? cb : nope;

        var handler = {}, done = function() { if (self.isDone()) { cb.call(self); } };

        ['success', 'error'].forEach(function(key) {
          handler[key] = function(item, data) {
            item.status = key;
            item.data = data;
            self[key + 'Count'] += 1;
            done();
          };
        });

        // when the queue is empty
        done();

        this.each(function(item) {
          var type = item.type, path = item.path, result = false;

          this.cache[type + '|' + path] = item;

          if (type in Loader) {
            item.target = Loader[type](item, handler.success, handler.error);
          } else {
            throw new Error('Can not find Loader for you resource ' + path);
          }
        });

        this.add = function() { throw new Error('Can not add resource anymore'); };
      }
    };

    return {
      Loader: Loader,
      Manager: Manager
    };
  });