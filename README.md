# mora

[![Build Status](https://travis-ci.org/qiu8310/mora.svg?branch=master)](https://travis-ci.org/qiu8310/mora)
[![Coverage Status](https://coveralls.io/repos/qiu8310/mora/badge.png)](https://coveralls.io/r/qiu8310/mora)
[![Code Climate](https://codeclimate.com/github/qiu8310/mora/badges/gpa.svg)](https://codeclimate.com/github/qiu8310/mora)

[ ![Codeship Status for qiu8310/mora](https://www.codeship.io/projects/f2a97a80-327e-0132-5f38-3ab195f80b5d/status)](https://www.codeship.io/projects/40384)

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

### [JSHint](http://jshint.com/docs/#options)

* `/* exported someVariable */` 告诉 jshint 这个变量只是在本文件中定义，不被本文件使用，避免 jshint 报 `unused` 错误

* 批量 ignore

    	// Code here will be linted with JSHint.
    	/* jshint ignore:start */
    	// Code here will be linted with ignored by JSHint.
    	/* jshint ignore:end */
     
* `/* falls through */` 不管是啥，告诉 jshint 这里不要报错

* [所有设置选项](http://jshint.com/docs/options/)


## HTML
[jade](http://jade-lang.com/reference)



## Test

[jasmine](http://jasmine.github.io/2.0/introduction.html)

[karma](http://karma-runner.github.io/)

[coveralls](https://coveralls.io/r/qiu8310/mora)

* [在 nodejs 中集成 travis 和 coveralls ](http://blog.chrisyip.im/nodejs-travis-ci-and-coveralls)


## Code analysis

[codeclimate](https://codeclimate.com/github/qiu8310/mora)