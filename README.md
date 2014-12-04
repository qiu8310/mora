# mora


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