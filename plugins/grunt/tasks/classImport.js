module.exports = function(grunt) {
  grunt.registerMultiTask( 'classImport', 'Auto import class to your specified css file', function() {

    // options
    var options = this.options({
      inspectAttr: 'data-ci-class' // 默认检查 data-ci-class 中的类名
    }),
      classContentMap; // 用户定义的所有 class 名称及其内容


    var regLineSep = /[\r\n]/g,
      regComment = /\/\*.*?\*\//g,
      regSpace = /\s+/,
      regTag = new RegExp('<[^>]+\\s(?:class|' + options.inspectAttr + ')\\s*=[^>]+>', 'gi'),
      regClass = /\s(?:class)\s*=\s*["']([^"']+)["']/i,
      regCustomClass = new RegExp('\\s(?:' + options.inspectAttr + ')\\s*=\\s*["\']([^"\']+)["\']', 'i');


    // 获取 html 文件中的所有 class
    // 一次处理一个文件
    function getHtmlClasses(file) {
      var content = grunt.file.read(file), result = [];

      // 去掉换行符
      content = content.replace(regLineSep, ' ');

      // 匹配标签
      var matches = content.match(regTag);
      if (matches) {
        matches.forEach(function(tag) {
          // 获取 tag 中的 class
          [regClass, regCustomClass].forEach(function(reg) {
            var classes = tag.match(reg);
            if (classes) {
              classes = classes[1].trim().split(regSpace);
              result = result.concat(classes);
            }
          });
        });
      }

      return result;
    }


    // 获取 css 文件中的所有 class 名称， 并关联 class 内容
    // 同时处理多个文件
    function getCssClasses(classFiles) {
      if (!Array.isArray(classFiles)) {
        classFiles = [classFiles];
      }

      var classMap = {};

      classFiles.forEach(function (file) {
        var content = grunt.file.read(file);

        // 去掉换行（@FIXED 在不去掉换行的情况下直接去掉注释，通过把 . 换成 \s\S ）
        content = content.replace(regLineSep, '');

        // 去掉注释
        content = content.replace(regComment, '');


        // 匹配一个个的 class
        var matches = content.match(/[\w\- ]*?\..*?\s*\{.*?\}/g);
        if (matches) {
          matches.forEach(function(styleRule) {
            // 得到类名
            var className = styleRule.match(/\.([\w\-]+)/);
            className = className[1];

            // 组装
            if (className in classMap) {
              classMap[className] += ' ' + styleRule;
            } else {
              classMap[className] = styleRule;
            }

          });
        }

      });

      return classMap;
    }



    // 注入 class 到指定的文件
    function importClasses(content, destFile) {
      var destContent = grunt.file.read(destFile);

      var tplStart = '/**** classImport start ****/\n',
        tplEnd = '\n/**** classImport end ****/';

      // 删除上次注入的
      var startIndex = destContent.indexOf(tplStart),
        endIndex = destContent.indexOf(tplEnd);

      content = tplStart + content + tplEnd;

      if (startIndex >= 0 && endIndex >= 0) {
        destContent = destContent.substr(0, startIndex) + destContent.substr(endIndex + tplEnd.length);
      }

      grunt.log.ok('write to ' + destFile + ' ok');
      grunt.file.write(destFile, destContent + content);

    }


    if (!options.classFiles) {
      throw new Error('classFiles needed');
    }


    classContentMap = getCssClasses(
      grunt.file.expand(options.classFiles)
    );


    this.files.forEach(function(f) {
      var cache = {}, content = [];
      f.src.forEach(function(file) {
        getHtmlClasses(file).forEach(function(cls) {
          if (!(cls in cache) && (cls in classContentMap)) {
            cache[cls] = true;
            content.push(classContentMap[cls]);
          }
        });
      });

      importClasses(content.join('\n'), f.dest);
    });
  });
};