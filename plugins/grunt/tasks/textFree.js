var tf = require('text-free');

module.exports = function(grunt) {

  var defaultOptions = {
    commentStart: 'tfStart',
    commentEnd: 'tfEnd',
    tplStartTag: '{%',
    tplEndTag: '%}',
    noComment: false,
    editableFileExt: ['html', 'htm']
  };

  function getData(options) {
    var data;
    if (options.jsonFile) {
      data = grunt.file.readJSON(options.jsonFile);
    }

    if (!data) {
      grunt.fail.fatal('jsonFile error! Not set or json format error');
    }

    return data;
  }


  grunt.registerMultiTask( 'textFree', 'Leave the text to PM, no longer the problem of FE', function(command) {

    var options = this.options(defaultOptions),
      data = getData(options);

    if (options.noComment) {
      options.editableFileExt = [];
    }


    // TODO 与其它 task 通信
    if (command === '__set__') {
      //options.filters = [];
      //console.log('----------------------------');
      //console.log(grunt.config('textFree'));
      return ;
    }


    this.files.forEach(function(fSet) {
      fSet.src.forEach(function(file) {

        var ext = file.split('.').pop();
        var content = grunt.file.read(file);

        options.isHtml = options.editableFileExt.indexOf(ext) >= 0;

        grunt.file.write(fSet.dest, tf(content, data, options));

      });
    });
  });

};