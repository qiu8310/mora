angular.module('moraApp')
  .service('HttpInterceptor', function ($q, $rootScope) {
    return {

      // requestError: function(rejection) {}

      request: function(request) {
        request.data = request.data || {};
        //TODO 往 data 写入 token 相关信息

        // 放行带 . 的 url，主要是请求一些模板类的文件
        if (request.url.indexOf('.') > 0) {
          return request;
        }

        // 处理 user/exist
        var paths = request.url.split('/'),
          phpFile = 'http://mora.com/api/' + paths.shift() + '.php?',

          module = paths.shift() || 'index',
          action = paths.shift() || 'index';

        request.url = phpFile + 'm=' + module + '&a=' + action;

        console.log(request);

        return request;
      },


      response: function (response) {
        // TODO store token

        return response;
      },

      responseError: function(response) {
        if (response.status === 401) {
          $rootScope.$broadcast('HTTPError', 'Login Required');
        } else if (response.status === 403) {
          $rootScope.$broadcast('HTTPError', 'Not allowed');
        } else if (response.status >= 400 && response.status < 500) {
          $rootScope.$broadcast('HTTPError', 'Server was unable to find what you were looking for... Sorry!!');
        } else if (response.status >= 500 && response.status < 600) {
          $rootScope.$broadcast('HTTPError', 'There is something wrong with the server, please contact the administrator!!');
        }
        return $q.reject(response);
      }

    };
  });
