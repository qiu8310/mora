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

        function up(file, token) {
          var fd, key, xhr;
          fd = new FormData();
          key = 'file_' + _.now();
          xhr = new XMLHttpRequest();

          fd.append('token', token);
          fd.append('unique_names', false);
          //fd.append('key', key);
          fd.append('file', file);


          xhr.open('POST', url, true);
          xhr.onload = function() {
            console.log('===========', this.response);
            //if (this.status === 200) {
              //var data = JSON.parse(this.response);
              //
              //$timeout(function() {
              //  scope.uploader = data._FILES[key].url;
              //}, 0);
            //}
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
