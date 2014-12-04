angular.module('moraApp')
  .service('HttpInterceptor', function (_, $q, $rootScope, Auth) {

    var API_BASE = 'http://staging-neo.llsapp.com/',
      PREFIX = 'api';

    return {

      // requestError: function(rejection) {}

      request: function(request) {
        // 放行非 api 开头的请求，主要是请求一些模板类的文件
        var url = request.url, identifier;
        if (url.indexOf(PREFIX) !== 0) {
          return request;
        }

        identifier = url.split('/')[1];
        switch (identifier) {
          case 'login':
          case 'logout':
            url = url.replace(PREFIX + '/' + identifier, 'ops/sessions');
            break;
          default:
            url = 'ops/study_groups' + url.substr(PREFIX.length);
        }

        request.url = API_BASE + url;

        // 把 token 写入到 header 中
        var token = Auth.getToken();
        //request.headers[['Mora-Authenticate']] = 'Basic token="' + token + '"';
        token = token ? {token: token} : {};


        // 从驼峰式的参数变成下划线式的，与后台风格统一
        //request.params = _.assign(_.underscoreCase(request.params) || {}, token);
        //request.data   = _.assign(_.underscoreCase(request.data) || {}, token);
        request.params = _.assign(request.params || {}, token);
        request.data   = _.assign(request.data || {}, token);

        return request;
      },


      response: function (response) {

        if (response.config.url.indexOf(API_BASE + 'ops/') !== 0) {
          return response;
        }


        // 将下划线式的参数变成驼峰式的，与前台风格统一
        console.info(response.config.url.replace(API_BASE + 'ops/', ''), response.data);
        //response.data = _.camelCase(response.data);

        // 保存 token 到本地
        //var headers = response.headers();
        //Auth.setToken(headers['mora-authenticate']);

        if (response.data.token) {
          Auth.setToken(response.data.token);
        }


        return response;
      },


      responseError: function(response) {

        if (response.status === 401) {
          $rootScope.$broadcast('login:required');
        } else if (response.status === 403) {
          $rootScope.$broadcast('HTTPError', 'You are not allowed to access this page!!');
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
