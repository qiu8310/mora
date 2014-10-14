### demo 文件夹

* 里面只能存放 `jade` 和 `html` 文件，任何其它文件都不会处理

### learn 文件夹

* 可以存放各类文件，但只会处理 `jade`，其它文件都原样拷贝到发布目录


### 插件：classImport  文件夹：styles/useful

文件夹里的样式会自动注入到你指定的文件中，不需要手动引入到你的HTML文件中

**工作原理**

1. 指定 所有HTML文件 及 CSS源文件夹（即 styles/useful）
2. 指定要注入到的CSS目标文件
3. 程序自动查找HTML中出现的所有CLASS，再从CSS文件中查找所有的CLASS，取出共同的CLASS注入到第2步指定的文件中

**特点**

* CSS中，不支持下划线的 CLASS 名，只能用中划线
* CSS中，支持定义 `:after` `:before` 或 `::after` `::before` 等类型的伪类及伪元素
* CSS中，不支持 `media`，不支持多层级的 CLASS，如 `.nav .link`，程序只会把它当作 `.nav`
* CSS中，主要用CLASS NAME，如果用了TAG NAME，则会忽略它而取它后面的 CLASS NAME，如 table.text-wrap
* HTML中，如果某个样式`foo`是在动态插入到 HTML 中的话，可以在标签上加个属性 `data-ci-class="foo"`
* HTML中，一定要避免标签中内嵌标签，如这种形式：`<a href="<<= value >>" class="target"> Link </a>`

### Tips

* 为了支持 POST，默认 angular POST 的 Content-Type 是 application/json，但 PHP 的 $_POST 是只会解析 application/x-www-form-urlencoded 的，所以需要在 angular app.js 里设置：

        $httpProvider.defaults.transformRequest = function(obj) {
          if (typeof obj === 'string') {
            return obj;
          }
          var params = [];
          angular.forEach(obj, function(val, key) {
            params.push(encodeURIComponent(key) + '=' + encodeURIComponent(val));
          });
          return params.join('&');
        };
    
        angular.extend($httpProvider.defaults.headers.post, {
          'Content-Type': 'application/x-www-form-urlencoded'
        });

** 也可以不在前端实现，而在后端去根据前端的 Content-Type 去获取对应的数据，如 PHP 获取 application/json 数据可以用:  **
    
        json_decode(file_get_contents('php://input'), true)


** form 上加 `enctype="multipart/form-data"` 会将 Content-Type 设为了 `multipart/form-data` **

