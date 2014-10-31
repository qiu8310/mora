/**
 * Reference: Compression Code
 * https://github.com/expressjs/compression/blob/master/index.js
 *
 */

var tf = require('text-free'),
  fs = require('fs'),
  path = require('path');

function getConfig(grunt) {
  var defaultOptions = {
    postUrl: '/textfree/update',
    commentStart: 'tfStart',
    commentEnd: 'tfEnd',
    tplStartTag: '{%',
    tplEndTag: '%}',
    noComment: false,
    editableFileExt: ['html', 'htm']
  };

  var config = grunt.config('textFree') || {};

  Object.keys(defaultOptions).forEach(function(key) {
    if (!(key in config.options)) {
      config.options[key] = defaultOptions[key];
    }
  });

  if (config.options.noComment) {
    config.options.editableFileExt = [];
  }

  return config;
}


module.exports = function(grunt, serverDirs) {


  if (!grunt.task.exists('textFree')) {
    throw new Error('connect-text-free need grunt-text-free plugin');
  }

  var config = getConfig(grunt),
    options = config.options;


  var nope = function() {};
  var data = options.jsonFile ? grunt.file.readJSON(options.jsonFile) : {};

  var filterFiles = options.filters;
  if (!filterFiles || !Array.isArray(filterFiles)) {
    throw new Error('Should set filters in grunt-text-free plugin, and it\'s value should be a string array');
  }
  filterFiles = grunt.file.expand(filterFiles);

  /**
   * 根据 request url 找到对应的文件
   *
   */
  function findFileByRequestUrl(url) {
    var result;
    serverDirs.forEach(function(dir) {
      if(grunt.file.exists(dir, url)) {
        result = path.join(dir, url);
        return false;
      }
    });
    return result;
  }

  /**
   * 过滤 request url
   * @param req
   * @returns {boolean}
   */
  function filter(req) {
    var file = findFileByRequestUrl(req.url);
    return filterFiles.indexOf(file) >= 0;
  }


  /**
   * 向 html 中插入一段 js 脚本
   *
   * JS 脚本插入在 </body> 上面，如果不存在，则不插入
   */
  function inject(htmlContent) {
    var injectContent = '<script type="text/javascript">document.write(\'<script src="' +
                        options.injectScript + '" type="text/javascript"><\\/script>\');</script>';

    injectContent = '<script>var __textFreeOptions = ' + JSON.stringify(options)
                    + '</script>' + injectContent;

    return htmlContent.replace('</body>', injectContent + '</body>');
  }


  function setData(key, val, data) {
    if (typeof key !== 'string' || typeof val !== 'string') {
      return false;
    }

    var keys = key.trim().split('.'),
      ref = data;

    while(keys.length > 1) {
      key = keys.shift();
      if (!key) {
        break;
      }

      if (!(key in ref)) {
        ref = null;
        break;
      }

      ref = ref[key];
    }

    key = keys[0];

    if (ref === null || !(key in ref)) {
      return false;
    }

    ref[key] = val;

    return true;
  }


  function toArray(arrayLikeObj) {
    return [].slice.call(arrayLikeObj);
  }


  function getPostData(post) {
    // 解析 formData TODO: 找一个开源的处理程序
    var sep = post.split('\r\n')[0],
      params = {};
    post = post.split(sep);
    post.pop();
    post.shift();
    post.forEach(function(item) {
      var key, val;
      item = item.trim().split('\r\n\r\n');
      key = item.shift();
      val = item.join('\r\n\r\n');
      key = key.match(/name="([\w\-\_\.]*)"/);
      if (key) {
        params[key[1]] = val;
      }
    });
    return params;
  }

  return function(req, res, next) {
    var reqUrlExt = req.url.split('.').pop();


    // 更新源数据请求
    if (req.url === options.postUrl) {
      var post = [];

      req.on('data', function(chunk) {
        if (chunk && chunk.length) { post.push(chunk.toString()); }
      });

      req.on('end', function(chunk) {
        if (chunk && chunk.length) { post.push(chunk.toString()); }
        var params = getPostData(post.join('').trim());
        var result = {status: 0, msg: 'ok'};

        // 将 params 写回到 源文件
        Object.keys(params).forEach(function(key) {
          if (false === setData(key, params[key], data)) {
            result.status = '404';
            result.msg = 'you key [' + key + '] was not exist';
            return false;
          }
        });

        // console.log(data);

        // TODO 不要覆盖之前的文件
        grunt.file.write(options.jsonFile, JSON.stringify(data, null, '\t'));

        // 返回结果
        res.end(JSON.stringify(result));
      });



      return false;
    }


    // 防止 304
    if (filter(req, res)) {
      req.headers['if-none-match'] = 'no-match-for-this';
      req.headers['if-modified-since'] = new Date(1);
    }


    req.on('close', function() {
      res.write = res.end = nope;
    });

    function transformChunk(chunk) {
      if (chunk && chunk.length && filter(req, res)) {
        options.isHtml = options.editableFileExt.indexOf(reqUrlExt) >= 0;
        var content = tf(chunk.toString(), data, options);
        return options.isHtml ? inject(content) : content;
      }
      return chunk;
    }

    var _write = res.write, _end = res.end,
      _writeHead = res.writeHead, _setHeader = res.setHeader;

    res.write = function(chunk, encoding) {
      _write.call(res, transformChunk(chunk), encoding);
    };

    res.end = function(chunk, encoding) {
      _end.call(res, transformChunk(chunk), encoding);
    };

    res.writeHead = function() {
      //console.log(toArray(arguments));
      _writeHead.apply(res, toArray(arguments));
    };

    res.setHeader = function() {
      //console.log(toArray(arguments));
      _setHeader.apply(res, toArray(arguments));
    };


    next();

  };
};