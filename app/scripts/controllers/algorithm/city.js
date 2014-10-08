'use strict';

angular.module('moraApp')
  .controller('AlgorithmCityCtrl', function (Algorithm, $scope) {

    var DEBUG = false;

    var Point = Algorithm.Point,
      Line = Algorithm.Line,
      Rectangle = Algorithm.Rectangle;

    var gCrossPoints = {}, gLines = [], gStartCrossPoint, gRSUCrossPoints = [], gEndCrossPoint, gPath = [];

    /**
     * 城市十字路口
     */
    var _crossPointIndex = 0;
    var CrossPointType = {
      END: 'end',
      START: 'start',
      RSU: 'rsu',
      NORMAL: 'normal'
    };
    var CrossPoint = function(point) {
      this.point = point;
      this.name = 'c_' + (++_crossPointIndex);
      this.type = CrossPointType.NORMAL;
      this.distance = {}; // 到其它各点的直线距离

      this.linePointLength = 0; // 和多少个点连线了
      this.linePointNames = []; // 和它连线的所有点
    };
    CrossPoint.prototype.addLinePoint = function(cp) {
      this.linePointNames.push(cp.name);
      this.linePointLength++;
      cp.linePointNames.push(this.name);
      cp.linePointLength++;
    };

    // 保存到每点的距离的排序
    CrossPoint.prototype.getDistance = function(target) {
      if ((target.name in this.distance) || this === target) { return false; }
      var distance = Math.round(Math.sqrt(Math.pow(this.point.x - target.point.x, 2) + Math.pow(this.point.y - target.point.y, 2)));
      this.distance[target.name] = distance;
      target.distance[this.name] = distance;
    };

    // 得到最近点的队列
    CrossPoint.prototype.getNearestPointNames = function() {
      var names = _.keys(this.distance), self = this;
      return _.sortBy(names, function(name) { return self.distance[name]; });
    };


    // 城市的大小
    $scope.size = {
      width: 800,
      height: 500
    };

    // 城市中的道路的类型
    $scope.road = {
      types: {rect: '井字形马路', triangle: '三角形的马路'},
      type: 'triangle'
    };

    // 其它选项
    $scope.options = {
      padding: {value: 20, label: '城市四边的空白区域大小'},
      minHorizontalDistance: {value: 40, label: '水平两点之间的最小距离'},
      minVerticalDistance: {value: 40, label: '垂直两点之间的最小距离'},
      rsuPointNumber: {value: 10, label: 'RSU点的数量'},

      normalColor: {value: '#0000ff', type: 'color', label: '普通线路的颜色'},
      rsuColor: {value: '#00ff00', type: 'color', label: 'RSU路口的颜色'},
      startColor: {value: '#ff0000', type: 'color', label: '起点路口的颜色'},
      endColor: {value: '#ffff00', type: 'color', label: '结束线路的颜色'}
    };


    // 对应不同马路可以设置的不同的变量
    $scope.roadTypeOptions = {
      rect: {
        removePointNumber: {value: 20, label: '去除城市中的交叉路口的数量'}
      },

      triangle: {
        crossPointNumber: {value: 30, label: '城市中含有交叉路口的数量'}
      }
    };


    function _canAddLine(line) {
      return _.every(gLines, function(l) { return line.joinWith(l) || !line.crossWith(l); });
    }


    // 生成一个起点，及RSU
    $scope.generateRandomCrossPoints = function() {
      var len = 0;
      _.each(gCrossPoints, function(cp) { cp.type = CrossPointType.NORMAL; len++; });

      if (len === 0) {
        return false;
      }

      gStartCrossPoint = _.sample(gCrossPoints);
      gStartCrossPoint.type = CrossPointType.START;

      gRSUCrossPoints = _.filter(_.sample(gCrossPoints, $scope.options.rsuPointNumber.value), function(cp) {
        if (cp.type !== CrossPointType.START) {
          cp.type = CrossPointType.RSU;
          return true;
        } else {
          return false;
        }
      });

      _render();
    };


    // 生成城市模型
    $scope.generateCityModel = function() {
      gCrossPoints = {};
      gLines = [];

      // 城市平面（其实就是个矩形）
      var centerPoint = new Point($scope.size.width * 0.5, $scope.size.height*0.5);

      var plane = new Rectangle(centerPoint, $scope.size.width, $scope.size.height);

      var points = plane.generatePoints($scope.options.padding.value,
                                        $scope.options.minHorizontalDistance.value,
                                        $scope.options.minVerticalDistance.value);

      var roadOptions = $scope.roadTypeOptions[$scope.road.type];
      switch ($scope.road.type) {
        case 'triangle':
          points = _.sample(points, roadOptions.crossPointNumber.value);
          break;
        case 'rect':
          points = _.sample(points, points.length - roadOptions.removePointNumber.value);
          break;
      }

      // 生成 CrossPoint
      var crossPoints = _.map(points, function(p) { var cp = new CrossPoint(p); gCrossPoints[cp.name] = cp; return cp; });

      // 计算每两 CrossPoint 之间的距离
      _.each(crossPoints, function(cp) { _.each(crossPoints, function(target) {cp.getDistance(target); }); });


      // 找几个最近的点，与它进行连线（每个点可以连 2-4 条线）
      var samples = $scope.road.type === 'rect' ? [3, 4] : [2, 3, 4];
      _.each(crossPoints, function(cp) {
        var lineCount = _.sample(samples),
          target,
          line;

        _.each(cp.getNearestPointNames(), function(name) {
          if(cp.linePointLength < lineCount) {
            target = gCrossPoints[name];
            line = new Line(cp.point, target.point);
            if (!line.isParallel && $scope.road.type === 'rect') {
              return true;
            }
            if (_canAddLine(line)) {
              gLines.push(line);
              cp.addLinePoint(target);
            }
          } else {
            return false;
          }
        });

      });


      $scope.generateRandomCrossPoints();


      _render();
    };


    // 查找最近的 RSU
    $scope.searchNearestRSU = function() {
      if (!gStartCrossPoint) { return false; }

      var distance = {}, // 起点到每个点的最短距离
        path = {}; // 记录起点到每个点的最短路径的路线

      _.each(gCrossPoints, function(cp) {
        distance[cp.name] = cp === gStartCrossPoint ? 0 : Infinity; // 初始化为无穷大（到它自己的距离当然为0）
        path[cp.name] = gStartCrossPoint.name; // path 都是空的
      });

      var startCP = gStartCrossPoint,
        finishCPs = {}, // 已经处理过的点
        minDistance, minName;
      while(startCP) {
        finishCPs[startCP.name] = true;

        console.groupCollapsed(startCP.name);
        _.each(startCP.linePointNames, function(name) {
          var target = gCrossPoints[name],
            targetDistance = distance[startCP.name] + startCP.distance[name];
          if (targetDistance < distance[name]) {
            distance[name] = targetDistance;

            // 生成从起点 gStartCrossPoint 经过 startCP 到 target 的路径
            path[name] = path[startCP.name] + ',' + target.name;
          }
        });

        // 寻找 distance 中最短的一条
        minDistance = Infinity;
        minName = false;
        _.each(distance, function(len, name) {
          if (len < minDistance && !finishCPs[name]) {
            minDistance = len;
            minName = name;
          }
        });

        startCP = minName ? gCrossPoints[minName] : null;

        console.groupEnd();

      }

      console.log('result distance: %o path: %o', distance, path);


      // 遍历 RSU
      var nearCP = null;
      _.each(gRSUCrossPoints, function(cp) {
        if (nearCP === null || distance[cp.name] < distance[nearCP.name]) {
          nearCP = cp;
        }
      });

      if (!nearCP) {
        alert('没找到最近的 RSU');
      } else {
        gEndCrossPoint = nearCP;
        gPath = [gStartCrossPoint.point.x, gStartCrossPoint.point.y];
        _.each(path[nearCP.name].split(','), function(name) {
          var p = gCrossPoints[name].point;
          gPath.push(p.x);
          gPath.push(p.y);
        });
        console.log('gPath %o', gPath);
        _renderResult();
      }

    };


    // 把 gLines, gCrossPoints 渲染出来
    var stage = new Kinetic.Stage({
      container: 'stage'
    });

    var debug = [];
    function _clickOnCircle() {
      var cp = gCrossPoints[this.attrs.name];
      console.log(cp);
      if (debug.length < 2) {
        debug.push(cp);
      }

      if (debug.length === 2) {
        // debug
        //var l = new Line(debug[0].point, debug[1].point);
        //console.log(l);

      } else if (debug.length > 2) {
        debug = [];
      }
    }


    function _renderResult() {
      _render();
      var layer = new Kinetic.Layer();
      layer.add(new Kinetic.Line({
        points: gPath,
        stroke: $scope.options.endColor.value
      }));

      layer.add(new Kinetic.Circle({
        fill: $scope.options.endColor.value,
        radius: 4,
        x: gEndCrossPoint.point.x,
        y: gEndCrossPoint.point.y,
        name: gEndCrossPoint.name
      }));

      stage.add(layer);
    }

    function _render() {
      var layer = new Kinetic.Layer();
      stage.destroyChildren();
      stage.width($scope.size.width);
      stage.height($scope.size.height);

      _.each(gLines, function(line) {
        layer.add(new Kinetic.Line({
          points: [line.p1.x, line.p1.y, line.p2.x, line.p2.y],
          stroke: $scope.options.normalColor.value
        }));
      });

      _.each(gCrossPoints, function(cp) {
        var circle = new Kinetic.Circle({
          fill: $scope.options[cp.type + 'Color'].value,
          radius: 4,
          x: cp.point.x,
          y: cp.point.y,
          name: cp.name,
          listening: true
        });
        circle.on('click', _clickOnCircle);

        if (DEBUG) {
          layer.add(new Kinetic.Text({
            x: cp.point.x,
            y: cp.point.y,
            offset: {x: 3, y: 3},
            text: cp.name,
            fill: $scope.options[cp.type + 'Color'].value
          }));
        }

        layer.add(circle);
      });



      stage.add(layer);
      layer.draw();
    }

    // 初始化
    $scope.generateCityModel();
    angular.extend(document.querySelector('.kineticjs-content').style, {
      margin: '10px auto',
      marginLeft: 'auto',
      marginRight: 'auto',
      display: 'block',
      border: '1px solid ghostwhite'
    });
  });
