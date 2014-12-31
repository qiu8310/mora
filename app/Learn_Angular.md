## TODO 把我写的一些有用的代码放进来


## 优化建议

[https://github.com/atian25/blog/issues/5](https://github.com/atian25/blog/issues/5)

总结：1. 尽少触发 $digest；  2. 尽快执行 $digest。


## 最佳实践

[官方：Best Practices](https://github.com/angular/angular.js/wiki/Best-Practices)

[官方：Anti Patterns](https://github.com/angular/angular.js/wiki/Anti-Patterns)



## 深入理解Scope

[中文翻译版](http://www.ifeenan.com/angularjs/2014-08-19-%5B译%5D深入理解NG里的scope%2F)

[英文原版](https://github.com/angular/angular.js/wiki/Understanding-Scopes)

[官方：Understanding  Scopes](https://github.com/angular/angular.js/wiki/Understanding-Scopes)



## 深入理解Directive里的 compile 和 link

[http://www.jvandemo.com/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives/](http://www.jvandemo.com/the-nitty-gritty-of-compile-and-link-functions-inside-angularjs-directives/)

[官方：Understanding Directive](https://github.com/angular/angular.js/wiki/Understanding-Directives)



## 理解$apply

> 是否遇到过 Error: $apply already in progress

### 解决方案：

1. 使用 `$timeout(fn, 0)`， 而不是 `$scope.$apply(fn)`
2. 使用下面方法

```js
  $scope.safeApply = function (fn) {
    var phase = this.$root.$$phase;
    if (phase === '$apply' || phase === '$digest') {
      if (fn && (typeof fn === 'function')) {
        fn();
      } else if (typeof fn === 'string')) {
        this.$eval(fn);
      }
    } else {
      this.$apply(fn);
    }
  };
```

### 理解 $apply

* [http://jimhoskins.com/2012/12/17/angularjs-and-apply.html](http://jimhoskins.com/2012/12/17/angularjs-and-apply.html)
  * $apply 中会调用 $digest
  * `$scope.$apply(fn)` 与 `fn(); $scope.$apply()` 的区别在于前者不会出错(详细请看下面$apply的简化版源码)
  ```js
  $scope.$apply = function(fn) {
    try {
      fn();
    } 
    catch (e) { }
    finally { $scope.$digest() }
  };
  ```





## 装饰 Service/Directive

> 对于一些第三方的程序，可能不能完全满足你的需求，这时可以用此技术来对原程序进行一层封装

[Angular Hacking Core](http://briantford.com/blog/angular-hacking-core)

[示例](http://plnkr.co/edit/cLUSw27TuB0iFx6er5l2?p=preview)

```html
<img ng-src="nofound"/>
<img ng-src="nofound2" err-src="http://app.qlogo.cn/mbloghead/4ebe87fca7f007fbcc06/50"/>
<img ng-src="http://atian25.github.io/img/logo.png"/>
```

```js
  angular.module('app').config(['$provide', function($provide){
    $provide.decorator('ngSrcDirective', ['$delegate', function($delegate){
      var ngSrc = $delegate[0];
      var old = ngSrc.compile;
      ngSrc.compile = function (element, attrs) {
        element.bind('error', function(e){
          if(attrs.errSrc){
            attrs.$set('src', attrs.errSrc);
          }else{
            element.addClass('ng-hide');
          }
        });
        return old.apply(this, arguments);
      };
      return $delegate;
    }]);
  }]);
```



## 动态加载 Controller/Service/Directive/...

### 主要原理：
* 在config期保存$controllerProvider/$provide等引用
* 监听ngRoute的$routeChangeStart事件
* 利用route的resolve去动态加载
* https://github.com/atian25/angular-lazyload

### 动态加载module
* hack module的加载机制
* https://github.com/ocombe/ocLazyLoad




## 共享模板

> 有些模板可能要在多个页面中使用，但模板里的数据又不一样，很自然我们会想到用 Directive，但还有其它方法

* ngInit 指令：    `<div ng-include ="'partials/part.html'" ng-init="type='billing'"></div>`
* onInclude 事件： `<div ng-include ="'partials/part.html'" onInclude="type='billing'"></div>`
* 创建一个指令
		

