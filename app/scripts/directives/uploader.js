'use strict';

angular.module('moraApp')
  .directive('uploader', function ($, C, _, $timeout, Env) {
    return {
      restrict: 'A',
      scope: {
        uploader: '='
      },
      link: function postLink(scope, element, attrs) {
        var url = C.res.uploader + '?prefix=' + (Env.isTest ? 'crm_test' : 'crm_dev');

        if (element.attr('type') === 'file') {
          element.on('change', function() {
            var file = this.files[0],
              fd, key, xhr;
            if (!file) { return false; }

            fd = new FormData();
            key = 'file_' + _.now();
            xhr = new XMLHttpRequest();

            fd.append(key, file);

            xhr.open('POST', url, true);
            xhr.onload = function() {
              if (this.status === 200) {
                var data = JSON.parse(this.response);
                $timeout(function() {
                  scope.uploader = data._FILES[key].url;
                }, 0);
              }
            };
            xhr.send(fd);

          });
        }
      }
    };
  });
