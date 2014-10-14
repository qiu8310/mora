angular.module('moraApp')
  .service('HttpInterceptor', function ($q, $rootScope, Auth) {
    var API_BASE = 'http://mora.com/';

    return {

      // requestError: function(rejection) {}

      request: function(request) {
        // 放行非 api 开头的请求，主要是请求一些模板类的文件
        if (request.url.indexOf('api/') !== 0) {
          return request;
        }

        request.url = API_BASE + request.url;

        // 把 token 写入到 header 中
        var token = Auth.getToken();
        if (token) {
          request.headers[['Mora-Authenticate']] = 'Basic token="' + token + '"';
        }

        return request;
      },


      response: function (response) {
        if (response.config.url.indexOf(API_BASE + 'api/') !== 0) {
          return response;
        }

        // 保存 token 到本地
        var headers = response.headers();

        Auth.setToken(headers['mora-authenticate']);

        return response;
      },


      responseError: function(response) {
        if (response.status === 401) {
          $rootScope.$broadcast('HTTPError', 'Login Required');
        } else if (response.status === 403) {
          $rootScope.$broadcast('HTTPError', 'Not allowed');
        } else if (response.status >= 400 && response.status < 500) {
          $rootScope.$broadcast('HTTPError',
            'Server was unable to find what you were looking for... Sorry!!');
        } else if (response.status >= 500 && response.status < 600) {
          $rootScope.$broadcast('HTTPError',
            'There is something wrong with the server, please contact the administrator!!');
        }
        return $q.reject(response);
      }

    };
  });
