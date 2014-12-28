# cheApp

## 问题

### 接口：
周边线路搜索接口（用经纬度搜索）
线路搜索接口（用线路名搜索）
线路详情接口（用线路number去查询）
获取收藏/更新收藏接口
获取所有城市列表接口

### 页面：
选择城市页
线路查询页
周边线路查询页
收藏页（仅微信支付宝支持）
线路详情页
实时线路说情页（还未出图）


### 关于产品的问题
1. 看到【收藏页】里有个搜索框，这个接口搜索时调用的是否【线路搜索接口】？
2. 【周边线路/线路查询/我的收藏】三个页面都有搜索框，它们的搜索历史记录是否是共用的（即是否我在【线路查询】的历史记录里能否看到我在【我的收藏】页面里的历史记录），并且样式都一样？
3. 在微信或支付宝页面中，它们提供一个导航可以直接切换到各个页面，但在H5页面上，用户如何从【线路查询页】切换到【周边线路查询页】？
4. 关于搜索历史记录，搜索历史保存在前端，用户微信重启之后会清空保存的历史记录数据，这个产品需要知道
5. 还是搜索历史记录，由于是实时搜索的，所以历史记录会比较多，需要产品确定一个方案来尽可能保存有效的历史记录（比如：只保存 N 条记录；用户输入关键字后 N 毫秒没变化才触发搜索；只有搜索有结果时才记录，没结果则不记录）

  
### 关于接口的问题
1. 接口里的参数可以统一下风格，有些参数首字母大写，有些小写，不知后台麻烦否，建议最好可以统一成首字母小写的驼峰形式
2. 如果上面【产品问题】的第1条是调用【线路搜索接口】的话，那么在【线路搜索接口】还需要返回一个字段告诉我这条线路我是否已经收藏了（类似于【周边线路搜索接口】）
3. 在微信/支付宝获取用户的 openId 如果在前台做的话不太好实现，建议后台判断当前环境，然后获取用户的 openId，然后将获取的 openId 通过 URL 的参数传给前端
4. 下拉刷新问题，看到你提供的搜索接口里不需要前端提供当前是第几屏这个参数吗，你们如何定位到我要拉取的是哪批数据？
5. 接口调用成功是返回有：status: "OK"，如果某些接口返回的 status 不为 OK 时，这些错误是否需要注明下，错误文案产品是否也需要确定下？




输入：userid、next，gps可选
输出: 线路基本信息+最近一辆车距离信息+是否收藏
（1）排序说明：距离从近到远依次展示各个聚合站中的线路；同一站点中不同方向的相同线路相邻展示
（2）限制：每次显示20条，下拉得到更多
（3）根据userid，查询数据库中用户的最后一次gps|站点，得到周边线路；
（4）只有微信、支付宝有收藏信息
接口调用请求说明


http://web.chelaile.net.cn/h5/querynearby?src=browser&userId=browser_1415776562403_48694929&s=h5&v=1.0.0

POSTBODY：
CityId=004&Lat=40.008463474733&Lng=116.41922313209&next=20

参数说明
参数	是否必须	说明
src	是	browser|wechat|alipay
s	是	来源
v	是	版本
userId	是	用户id
CityId	是	城市Id
Lat	否,与Lng同时存在or不存在	经度，当不存在时，后台从微信、支付宝用户表中拿
Lng	否,与Lat同时存在or不存在	纬度，当不存在时，后台从微信、支付宝用户表中拿
next	否	下拉参数，默认给前20条
```
    {
        "status": "OK",
        "data": {
            "underlyingContent": [
                {
                    "leftStopNum": 0,
                    "lineName": "16",
                    "lineNo": "068",
                    "direction": "1",
                    "lineId": "022-824-1",
                    "favStation": "半山村",
                    "nextStation": "里半山",
                    "isfav": "1",
                    "result": 0
                },
                {
                    "leftStopNum": 4,
                    "lineName": "33",
                    "lineNo": "027",
                    "direction": "0",
                    "lineId": "022-903-0",
                    "favStation": "半山村",
                    "nextStation": "里半山",
                    "isfav": "0",
                    "result": 0
                }
            ],
            "cityId": "004"
        }
    }
```














* 搜索最右边的城市切换文字，如果是4个字的城市，会放不下，所以我把 输入框缩小了 12px 宽度，是否可以接受

* 少给一个选择车站页面的 定位小图片

* 底部那个下载推广的 LOGO 没有，还有下载地址（iOS, android, 应用宝)

* 另外就是在非微信及支付宝下是否要单独定制一个头部，和尾部的导航


## Start

### Set up

    rvm use 2.1.1
    bundle install
    npm install
    npm install -g bower grunt-cli
    bower install

### Development

    grunt serve
    
### Test

    grunt test

### Publish frontend code to SAE

    grunt
    grunt publish

### Commit
  
    git push  # this will trigger Travis、Coveralls、CodeClimate、CodeShip


## Build tool

[grunt](http://gruntjs.com/)

[gulp](http://gulpjs.com/)

[travis](https://travis-ci.org/qiu8310/mora/builds)

* 在 git commit 的 message 中加入 `[ci skip]` 可以让 travis 不 build 你本次的提交


## CSS

[sass](http://sass-lang.com/)

[compass](http://compass-style.org/)

[sache (sass 库的一个集合，可以发现有用的代码)](http://www.sache.in/)


## Javascript

### Angular

* [本地实现 html5 模式开发及路径设定](http://jjt.io/2013/11/16/angular-html5mode-using-yeoman-generator-angular/)
* [设置服务器支持 html5 模式](https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode)

* [ui-route github quick reference](https://github.com/angular-ui/ui-router/wiki/Quick-Reference)
* [ui-route 实现在一个 view 里再嵌套其它 child view](http://scotch.io/tutorials/javascript/angularjs-multi-step-form-using-ui-router)
* [ui-route 用两种不同方案实现 view 嵌套](http://scotch.io/tutorials/javascript/angular-routing-using-ui-router)


### [JSHint](http://jshint.com/docs/#options)

* `/* exported someVariable */` 告诉 jshint 这个变量只是在本文件中定义，不被本文件使用，避免 jshint 报 `unused` 错误
* `/*jshint validthis:true */` 如果 function 不是 controller，则不能用关键字 this，用这个语句可以避免 jshint 报错
* 批量 ignore

    	// Code here will be linted with JSHint.
    	/* jshint ignore:start */
    	// Code here will be linted with ignored by JSHint.
    	/* jshint ignore:end */
     
* `/* falls through */` 在 switch case 语句中不加 break 会报错，可以用此命令压制
* [所有设置选项](http://jshint.com/docs/options/)
* .jshintrc
  
  
      {
        "node": true,
        "browser": true,
        "esnext": true,
        "bitwise": true,
        "camelcase": true,
        "curly": true,
        "eqeqeq": true,
        "immed": true,
        "indent": false,
        "latedef": "nofunc",
        "newcap": true,
        "noarg": true,
        "quotmark": "single",
        "undef": true,
        "unused": "vars",
        "strict": false,
        "trailing": true,
        "smarttabs": true,
        "globals": {
          "angular": false
        }
      }


## HTML

[jade](http://jade-lang.com/reference)

### 标签相关
[autocomplete](https://html.spec.whatwg.org/multipage/forms.html#autofill)



## Test

[jasmine](http://jasmine.github.io/2.0/introduction.html)

[karma](http://karma-runner.github.io/)

[coveralls](https://coveralls.io/r/qiu8310/mora)

* [在 nodejs 中集成 travis 和 coveralls ](http://blog.chrisyip.im/nodejs-travis-ci-and-coveralls)


## Code analysis

[codeclimate](https://codeclimate.com/github/qiu8310/mora)
