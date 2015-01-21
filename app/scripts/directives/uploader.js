'use strict';

angular.module('moraApp')
  .directive('uploader', function ($, C, _, $timeout, Env, $http) {
    return {
      restrict: 'A',
      scope: {
        uploader: '='
      },
      link: function postLink(scope, element, attrs) {
        //var url = C.res.uploader + '?prefix=' + (Env.isTest ? 'crm_test' : 'crm_dev');

        var url = 'http://up.qiniu.com/';
        var prefix = Env.isTest ? 'crm_test_' : 'crm_';

        function up(file, token) {
          var fd, xhr, key, path;
          fd = new FormData();
          key = prefix + _.now() + '.' + file.name.split('.').pop();
          xhr = new XMLHttpRequest();

          fd.append('token', token);
          fd.append('key', key);
          fd.append('file', file);

          path = 'http://llss.qiniudn.com/' + key;


          xhr.open('POST', url, true);
          xhr.onload = function() {
            if (this.status === 200) {
              var data = JSON.parse(this.response);

              $timeout(function() {
                scope.uploader = path;
              }, 0);
            }
          };
          xhr.send(fd);
        }

        if (element.attr('type') === 'file') {
          element.on('change', function() {
            var file = this.files[0];
            if (!file) { return false; }

            $http.post('api/qiniu/tokens').success(function(data) {
              var token = data.uploadToken;
              up(file, token);
            });
          });
        }
      }
    };
  });
