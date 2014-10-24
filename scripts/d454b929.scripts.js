"use strict";angular.module("moraApp",["ngCookies","ngResource","ngSanitize","ui.router","angular-md5"]).config(["$stateProvider","$urlRouterProvider","$locationProvider","$httpProvider",function(a,b,c,d){c.html5Mode(!0).hashPrefix("!"),d.interceptors.push("HttpInterceptor"),angular.extend(d.defaults.headers.common,{"Powered-By":"Angular-Mora","Mora-Version":"v1"}),a.state("index",{url:"/",templateUrl:"views/home.html",controller:"HomeCtrl"}).state("signup",{url:"/signup",templateUrl:"views/signup.html",controller:"SignupCtrl"}).state("login",{url:"/login",templateUrl:"views/login.html",controller:"LoginCtrl"}).state("algorithm/city",{url:"/algorithm/city",templateUrl:"views/algorithm/city.html",controller:"AlgorithmCityCtrl"}),b.when("/home","/").when("/index","/").when("/main","/").otherwise(function(){window.location.href="/404.html"})}]),angular.module("moraApp").controller("RootCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("moraApp").controller("HomeCtrl",["$scope",function(a){a.share=function(a){location.href=a}}]),angular.module("moraApp").controller("SignupCtrl",["$scope","$http","md5",function(a,b,c){a.user={email:"qiuzhongleiabc@126.com",nickname:"Mora",password:"qiu8310",passwordCheck:"qiu8310"},a.submit=function(){b.post("api/user",{email:a.user.email,nickname:a.user.nickname,password:c.createHash(a.user.password)})}}]),angular.module("moraApp").controller("LoginCtrl",["$scope",function(a){a.awesomeThings=["HTML5 Boilerplate","AngularJS","Karma"]}]),angular.module("moraApp").controller("AlgorithmCityCtrl",["Shape","$scope",function(a,b){function c(a){return _.every(n,function(b){return a.joinWith(b)||!a.crossWith(b)})}function d(){var a=m[this.attrs.name];console.log(a),u.length<2&&u.push(a),2===u.length||u.length>2&&(u=[])}function e(){f();var a=new Kinetic.Layer;a.add(new Kinetic.Line({points:p,stroke:b.options.endColor.value})),a.add(new Kinetic.Circle({fill:b.options.endColor.value,radius:4,x:h.point.x,y:h.point.y,name:h.name})),t.add(a)}function f(){var a=new Kinetic.Layer;t.destroyChildren(),t.width(b.size.width),t.height(b.size.height),_.each(n,function(c){a.add(new Kinetic.Line({points:[c.p1.x,c.p1.y,c.p2.x,c.p2.y],stroke:b.options.normalColor.value}))}),_.each(m,function(c){var e=new Kinetic.Circle({fill:b.options[c.type+"Color"].value,radius:4,x:c.point.x,y:c.point.y,name:c.name,listening:!0});e.on("click",d),i&&a.add(new Kinetic.Text({x:c.point.x,y:c.point.y,offset:{x:3,y:3},text:c.name,fill:b.options[c.type+"Color"].value})),a.add(e)}),t.add(a),a.draw()}var g,h,i=!1,j=a.Point,k=a.Line,l=a.Rectangle,m={},n=[],o=[],p=[],q=0,r={END:"end",START:"start",RSU:"rsu",NORMAL:"normal"},s=function(a){this.point=a,this.name="c_"+ ++q,this.type=r.NORMAL,this.distance={},this.linePointLength=0,this.linePointNames=[]};s.prototype.addLinePoint=function(a){this.linePointNames.push(a.name),this.linePointLength++,a.linePointNames.push(this.name),a.linePointLength++},s.prototype.getDistance=function(a){if(a.name in this.distance||this===a)return!1;var b=Math.round(Math.sqrt(Math.pow(this.point.x-a.point.x,2)+Math.pow(this.point.y-a.point.y,2)));this.distance[a.name]=b,a.distance[this.name]=b},s.prototype.getNearestPointNames=function(){var a=_.keys(this.distance),b=this;return _.sortBy(a,function(a){return b.distance[a]})},b.size={width:800,height:500},b.road={types:{rect:"井字形马路",triangle:"三角形的马路"},type:"triangle"},b.options={padding:{value:20,label:"城市四边的空白区域大小"},minHorizontalDistance:{value:40,label:"水平两点之间的最小距离"},minVerticalDistance:{value:40,label:"垂直两点之间的最小距离"},rsuPointNumber:{value:10,label:"RSU点的数量"},normalColor:{value:"#0000ff",type:"color",label:"普通线路的颜色"},rsuColor:{value:"#00ff00",type:"color",label:"RSU路口的颜色"},startColor:{value:"#ff0000",type:"color",label:"起点路口的颜色"},endColor:{value:"#ffff00",type:"color",label:"结束线路的颜色"}},b.roadTypeOptions={rect:{removePointNumber:{value:20,label:"去除城市中的交叉路口的数量"}},triangle:{crossPointNumber:{value:30,label:"城市中含有交叉路口的数量"}}},b.generateRandomCrossPoints=function(){var a=0;return _.each(m,function(b){b.type=r.NORMAL,a++}),0===a?!1:(g=_.sample(m),g.type=r.START,o=_.filter(_.sample(m,b.options.rsuPointNumber.value),function(a){return a.type!==r.START?(a.type=r.RSU,!0):!1}),void f())},b.generateCityModel=function(){m={},n=[];var a=new j(.5*b.size.width,.5*b.size.height),d=new l(a,b.size.width,b.size.height),e=d.generatePoints(b.options.padding.value,b.options.minHorizontalDistance.value,b.options.minVerticalDistance.value),g=b.roadTypeOptions[b.road.type];switch(b.road.type){case"triangle":e=_.sample(e,g.crossPointNumber.value);break;case"rect":e=_.sample(e,e.length-g.removePointNumber.value)}var h=_.map(e,function(a){var b=new s(a);return m[b.name]=b,b});_.each(h,function(a){_.each(h,function(b){a.getDistance(b)})});var i="rect"===b.road.type?[3,4]:[2,3,4];_.each(h,function(a){var d,e,f=_.sample(i);_.each(a.getNearestPointNames(),function(g){return a.linePointLength<f?(d=m[g],e=new k(a.point,d.point),e.isParallel||"rect"!==b.road.type?void(c(e)&&(n.push(e),a.addLinePoint(d))):!0):!1})}),b.generateRandomCrossPoints(),f()},b.searchNearestRSU=function(){if(!g)return!1;var a={},b={};_.each(m,function(c){a[c.name]=c===g?0:1/0,b[c.name]=g.name});for(var c,d,f=g,i={};f;)i[f.name]=!0,console.groupCollapsed(f.name),_.each(f.linePointNames,function(c){var d=m[c],e=a[f.name]+f.distance[c];e<a[c]&&(a[c]=e,b[c]=b[f.name]+","+d.name)}),c=1/0,d=!1,_.each(a,function(a,b){c>a&&!i[b]&&(c=a,d=b)}),f=d?m[d]:null,console.groupEnd();console.log("result distance: %o path: %o",a,b);var j=null;_.each(o,function(b){(null===j||a[b.name]<a[j.name])&&(j=b)}),j?(h=j,p=[g.point.x,g.point.y],_.each(b[j.name].split(","),function(a){var b=m[a].point;p.push(b.x),p.push(b.y)}),console.log("gPath %o",p),e()):window.alert("没找到最近的 RSU")};var t=new Kinetic.Stage({container:"stage"}),u=[];b.generateCityModel(),angular.extend(document.querySelector(".kineticjs-content").style,{margin:"10px auto",marginLeft:"auto",marginRight:"auto",display:"block",border:"1px solid ghostwhite"})}]),angular.module("moraApp").directive("uniqueValidate",["$http",function(a){return{require:"?ngModel",restrict:"A",link:function(b,c,d,e){var f=d.uniqueValidate.replace(/\s+/,"").split(".");if(2!==f.length)throw new Error('uniqueValidate directive should set to: unique-field="[table].[field]"');b.$watch(d.ngModel,function(b){if(e.$isEmpty(b))return!1;var c="api/"+f.join("/")+"/"+b;e.$setValidity("unique",null),a.get(c).success(function(a){e.$setValidity("unique",a.data.exist===!1)})})}}}]),angular.module("moraApp").directive("rangeValidate",function(){return{require:"?ngModel",restrict:"A",link:function(a,b,c,d){var e,f,g,h=c.rangeValidate.match(/(\d+)\-(\d+)\|?(\w+)?/);if(!h)throw new Error('rangeValidate should be set to something like this: range-validate="4-10"');e=parseInt(h[1],10),f=parseInt(h[2],10),g=h[3]||!1,d.$parsers.unshift(function(a){if(void 0!==a){var b=a.length,c=b>=e&&f>=b;return d.$setValidity("range",c),"filter"===g&&b>f&&(a=a.substr(0,f)),a}})}}}),angular.module("moraApp").directive("equalValidate",function(){return{require:["?ngModel","^form"],restrict:"A",link:function(a,b,c,d){var e=d[0],f=d[1],g=f[c.equalValidate];a.$watch(function(){return g.$modelValue+"|"+e.$modelValue},function(){if(e.$isEmpty(g.$modelValue)||e.$isEmpty(e.$modelValue))return void e.$setValidity("equal",null);var a=g.$modelValue===e.$modelValue;e.$setValidity("equal",a)})}}}),angular.module("moraApp").directive("formControl",function(){return{templateUrl:"views/tpls/form-control.html",transclude:!0,replace:!0,restrict:"E",require:"^form",scope:{label:"@",ref:"@"},link:function(a,b,c,d){a.feedback=void 0===c.feedback||c.feedback===!0;var e,f=c.layout,g=d[a.ref];f||(e=d.$name&&document[d.$name],f=e&&e.getAttribute("layout")),a.layout=(f||"3-9").split("-"),a.controlStatusClass=function(){if(!g)return!1;var b={"has-error":a.isErrorStatus(),"has-success":a.isSuccessStatus()};return angular.forEach(g.$error,function(a,c){"required"===c&&g.$pristine&&(a=!1),b["has-"+c+"-error"]=a}),b},a.isSuccessStatus=function(){return g&&g.$valid&&g.$dirty},a.isErrorStatus=function(){return g&&g.$invalid&&g.$dirty}}}}),angular.module("moraApp").service("HttpInterceptor",["$q","$rootScope","Auth",function(a,b,c){var d="http://mora.com/";return{request:function(a){if(0!==a.url.indexOf("api/"))return a;a.url=d+a.url;var b=c.getToken();return b&&(a.headers[["Mora-Authenticate"]]='Basic token="'+b+'"'),a},response:function(a){if(0!==a.config.url.indexOf(d+"api/"))return a;var b=a.headers();return c.setToken(b["mora-authenticate"]),a},responseError:function(c){return 401===c.status?b.$broadcast("HTTPError","Login Required"):403===c.status?b.$broadcast("HTTPError","Not allowed"):c.status>=400&&c.status<500?b.$broadcast("HTTPError","Server was unable to find what you were looking for... Sorry!!"):c.status>=500&&c.status<600&&b.$broadcast("HTTPError","There is something wrong with the server, please contact the administrator!!"),a.reject(c)}}}]),angular.module("moraApp").service("Auth",["Storage",function(a){var b;this.setToken=function(c){return b=c,a.set("token",c),c},this.getToken=function(){return b||a.get("token")}}]),angular.module("moraApp").factory("Shape",function(){function a(a){return"number"!=typeof a&&(a=a.toString&&a.toString(),a=a.indexOf(".")>=0?parseFloat(a):parseInt(a,10)),a||0}function b(b,c){this.x=a(b),this.y=a(c)}function c(a,b){var c=a.x<b.x||a.x===b.x&&a.y<b.y;this.p1=c?a:b,this.p2=c?b:a,this.isParallelX=a.y===b.y,this.isParallelY=a.x===b.x,this.isParallel=this.isParallelX||this.isParallelY,this.isBackslash=!this.isParallel&&a.y>b.y}function d(a,b){this.x=b.x-a.x,this.y=b.y-a.y}function e(a,b,c){this.centerPoint=a,this.width=b,this.height=c;var d=.5*b,e=.5*c;this.left=a.x-d,this.right=a.x+d,this.top=a.y-e,this.bottom=a.y+e}return b.prototype.equal=function(a){return this.x===a.x&&this.y===a.y},c.prototype.getCenterPoint=function(){return new b(.5*(this.p1.x+this.p2.x),.5*(this.p1.y+this.p2.y))},c.prototype.length=function(){return Math.sqrt(Math.pow(this.p2.x-this.p1.x,2)+Math.pow(this.p2.y-this.p1.y,2))},c.prototype.equal=function(a){return this.p1.equal(a.p1)&&this.p2.equal(a.p2)},c.prototype.joinWith=function(a){if(this.p1.equal(a.p1)&&this.p2.equal(a.p2))return!1;if(this.p1.equal(a.p2)||this.p2.equal(a.p1))return!0;var b=(a.p2.y-a.p1.y)*(this.p2.x-this.p1.x)===(this.p2.y-this.p1.y)*(a.p2.x-a.p1.x);return this.p1.equal(a.p1)||this.p2.equal(a.p2)?!b:!1},c.prototype.crossWith=function(a){if(Math.max(a.p2.x,a.p1.x)<Math.min(this.p2.x,this.p1.x)||Math.min(a.p2.x,a.p1.x)>Math.max(this.p2.x,this.p1.x)||Math.max(a.p2.y,a.p1.y)<Math.min(this.p2.y,this.p1.y)||Math.min(a.p2.y,a.p1.y)>Math.max(this.p2.y,this.p1.y))return!1;var b=new d(this.p1,this.p2),c=new d(a.p1,a.p2),e=new d(this.p1,a.p1),f=new d(this.p1,a.p2),g=new d(a.p1,this.p1),h=b.multiply(e),i=f.multiply(b),j=c.multiply(g),k=b.multiply(c);return h*i>=0&&j*k>=0},d.prototype.multiply=function(a){return this.x*a.y-this.y*a.x},e.prototype.getCornerPoints=function(){return[new b(this.left,this.top),new b(this.right,this.top),new b(this.left,this.bottom),new b(this.right,this.bottom)]},e.lineToRectangle=function(a){var b,c;return a.isParallel?(b=Math.abs(a.p1.x-a.p2.x||a.p1.y-a.p2.y),c=b):(b=Math.abs(a.p2.x-a.p1.x),c=Math.abs(a.p2.y-a.p1.y)),new e(a.getCenterPoint(),b,c)},e.prototype.containsPoint=function(a){return a.x>this.left&&a.x<this.right&&a.y>this.top&&a.y<this.bottom},e.prototype.crossWith=function(a){var b=!1,c=this;return c.containsPoint(a.centerPoint)||a.containsPoint(c.centerPoint)?!0:([c,a].forEach(function(d,e){var f=0===e?a:c;return d.getCornerPoints().forEach(function(a){return f.containsPoint(a)?(b=!0,!1):void 0}),b?!1:void 0}),b)},e.prototype.generatePoints=function(a,c,d){var e,f,g=this.left+a,h=this.right-a,i=this.top+a,j=this.bottom-a,k=[];for(f=i+1;j>f;f+=d)for(e=g+1;h>e;e+=c)k.push(new b(e,f));return k},{Point:b,Line:c,Vector:d,Rectangle:e}}),angular.module("moraApp").factory("Storage",function(){function a(a){return f?a.call(f):void 0}function b(b,c,d){return a(function(){var a=d?Date.now()+d:0;this[g+b]=JSON.stringify([c,a])}),c}function c(b,c){return a(function(){var a,d=Date.now(),e=g+b;try{a=JSON.parse(this[e])}catch(f){}if(!a||2!==a.length||a[1]&&d>a[1]){var h;return"function"==typeof c?(h=c(),this.setItem(e,h)):this.removeItem(e),h}return a[0]})}function d(b){a(function(){this.removeItem(g+b)})}function e(b){a(function(){var a,c;for(a in this)c=0===a.indexOf(g),"self"===b&&!c||"other"===b&&c||this.removeItem(a)})}var f=window.localStorage,g="_v1_";return{supported:!!f,set:b,get:c,del:d,empty:e}}),angular.module("moraApp").constant("Config",{});