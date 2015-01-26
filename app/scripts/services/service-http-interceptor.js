angular.module('mora.ui')
  .service('HttpInterceptor', function ($q, $rootScope, Env, C) {

    var loc = Env.win.location, PREFIX = 'api';
    var API_BASE = (Env.isLocal ? 'http://location:3000' : 'http://' +  loc.host) + '/neo_huodong/api/huodongs/2';

    return {
      // requestError: function(rejection) {}

      request: function(request) {
        // 放行非 api 开头的请求，主要是请求一些模板类的文件
        var url = request.url,
          params;

        if (url.indexOf(PREFIX) !== 0) {
          return request;
        }

        url = API_BASE + url.substr(PREFIX.length);
        params = {wechat: '1', refreshToken: Env.G.currentUser.refreshToken};

        url = ng.appendQuery(url, params);

        // 把 token 写入到 header 中
        //var token = Auth.getToken();
        //request.headers[['Mora-Authenticate']] = 'Basic token="' + token + '"';
        //token = token ? {token: token} : {};

        // 从驼峰式的参数变成下划线式的，与后台风格统一
        //request.params = _.assign(_.underscoreCase(request.params) || {}, token);
        //request.data   = _.assign(_.underscoreCase(request.data) || {}, token);
        //request.params = _.assign(request.params || {}, token);
        //request.data   = _.assign(request.data || {}, token);

        request.url = url;
        //request.url = Env.isTest && C.res.proxyUrl ? C.res.proxyUrl + '?_url=' + encodeURIComponent(url) : url;

        ng.info('request', url, request.data || {}, 'verbose:', request);

        return request;
      },


      response: function (response) {
        var url = response.config.url;
        if (Env.isTest) { url = ng.parseQuery(url)._url || url; }

        if (url.indexOf(API_BASE) !== 0) { return response; }

        // 将下划线式的参数变成驼峰式的，与前台风格统一
        //response.data = _.camelCase(response.data);

        // 保存 token 到本地
        //var headers = response.headers();
        //Auth.setToken(headers['mora-authenticate']);

        //if (response.data.token) {
        //  Auth.setToken(response.data.token);
        //}

        response.data = ng.camelCase(response.data);
        ng.info('response', url, response.data, 'verbose:', response);
        return response;
      },


      responseError: function(response) {
        if (response.config.url.indexOf('ignoreError') < 0) {
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
        }
        return $q.reject(response);
      }

    };
  });
