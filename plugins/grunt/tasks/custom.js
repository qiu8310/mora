module.exports = function(grunt) {
  grunt.registerTask( 'custom', 'custom command', function() {
    var args = this.args;

    var DIST = '/Users/mora/Workspace/sites/fcbst/1/wechat/builder',
        SRC  = '/Users/mora/Workspace/appevents/dist';


    grunt.file.recurse(SRC, function(abspath, rootdir, subdir, filename) {
      grunt.log.writeln(filename);
    });

  });
}