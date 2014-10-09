'use strict';

angular.module('moraApp')
  .factory('Algorithm', function () {
    // 可能用到的常数
    var SQRT_2_DIVISION_2 = Math.sqrt(2) * 0.5; // 2分之根号2，保存它的值

    function getNumber(x) {
      if (typeof x !== 'number') {
        x = x.toString && x.toString();
        if (x.indexOf('.') >= 0) {
          x = parseFloat(x);
        } else {
          x = parseInt(x, 10);
        }
      }
      return x || 0;
    }
    /*
     点
     */
    function Point(x, y) {
      this.x = getNumber(x);
      this.y = getNumber(y);
    }
    Point.prototype.equal = function(p) { return this.x === p.x && this.y === p.y; };

    /*
     线
        没有方向的线，由两个点组成
        虽然没有方向，但保证 p1.x < p2.x 或者 p1.x == p2.x && p1.y < p2.y
     */
    function Line(p1, p2) {
      var noReverse = p1.x < p2.x || p1.x === p2.x && p1.y < p2.y;
      this.p1 = noReverse ? p1 : p2;
      this.p2 = noReverse ? p2 : p1;

      // 是否与 X/Y 轴平行
      this.isParallelX = p1.y === p2.y;
      this.isParallelY = p1.x === p2.x;
      this.isParallel = this.isParallelX || this.isParallelY;

      // 是否是反斜线，反斜线的斜率(slope) < 0
      this.isBackslash = !this.isParallel && p1.y > p2.y;
    }
    // 获取此线的中点
    Line.prototype.getCenterPoint = function() {
      return new Point((this.p1.x + this.p2.x) * 0.5, (this.p1.y + this.p2.y) * 0.5);
    };

    // 线的长度
    Line.prototype.length = function() {
      return Math.sqrt(Math.pow(this.p2.x - this.p1.x, 2) + Math.pow(this.p2.y - this.p1.y, 2));
    };

    Line.prototype.equal = function(l) { return this.p1.equal(l.p1) && this.p2.equal(l.p2); };


    // 两条线相连，但不重合（可以延长）
    Line.prototype.joinWith = function(line) {
      // 一定只有一个端点相等，且两线不平行(斜率不相等)

      // p1 p2 是有大小的，小的是 p1，大的是 p2，所以不可能出现 this.p1 === line.p2 && this.p2 === line.p1
      if (this.p1.equal(line.p1) && this.p2.equal(line.p2)) {
        return false;
      }

      if (this.p1.equal(line.p2) || this.p2.equal(line.p1)) {
        return true;
      }

      // 斜率是否相等
      var isEqualSlope =  (line.p2.y - line.p1.y)*(this.p2.x - this.p1.x) ===
        (this.p2.y - this.p1.y)*(line.p2.x - line.p1.x);


      if (this.p1.equal(line.p1) || this.p2.equal(line.p2)) {
        return !isEqualSlope; // 斜率相等表示两条线重合了
      }

      return false;
    };

    // 判断两条线段是否能相交（一条线的一个点在另一条线上面，也算相交；两线重合也算相交）
    Line.prototype.crossWith = function(line) {
      // 第一步：矩形法排除：以 l1 为对角线的矩形与以 l2 为对角线的矩形没有任何交点
      // 或： 另一个方法就是线的两个点都在矩形的四边中的同一边外

      //if (!Rectangle.lineToRectangle(this).crossWith(Rectangle.lineToRectangle(line))) { return false; }
      if (Math.max(line.p2.x, line.p1.x) < Math.min(this.p2.x, this.p1.x) ||
        Math.min(line.p2.x, line.p1.x) > Math.max(this.p2.x, this.p1.x) ||
        Math.max(line.p2.y, line.p1.y) < Math.min(this.p2.y, this.p1.y) ||
        Math.min(line.p2.y, line.p1.y) > Math.max(this.p2.y, this.p1.y)) {
        return false;
      }

      // 第二步：利用向量的叉积
      // 叉积为正时 ＝>
      // 叉积为0时 ＝> 两向量同向或反向
      // 叉积为负时 ＝>
      var v1 = new Vector(this.p1, this.p2), // P2 - P1
        v2 = new Vector(line.p1, line.p2),  // Q2 - Q1
        v3 = new Vector(this.p1, line.p1),  // Q1 - P1
        v4 = new Vector(this.p1, line.p2),  // Q2 - P1
        v5 = new Vector(line.p1, this.p1);  // P1 - Q1

      var d1 = v1.multiply(v3),
        d2 = v4.multiply(v1),
        d3 = v2.multiply(v5),
        d4 = v1.multiply(v2);

      return d1 * d2 >= 0 && d3 * d4 >= 0;

    };



    // Vector 向量
    function Vector(p1, p2) {
      this.x = p2.x - p1.x;
      this.y = p2.y - p1.y;
    }

    // 向量相乘（叉积）
    Vector.prototype.multiply = function(v) {
      return this.x * v.y - this.y * v.x;
    };


    /*
     矩形
      由一个中点和宽高组成
      是没有计旋转角度的矩形哦！
     */
    function Rectangle(centerPoint, width, height) {
      this.centerPoint = centerPoint;
      this.width = width;
      this.height = height;

      var halfWidth = width * 0.5,
        halfHeight = height * 0.5;

      this.left = centerPoint.x - halfWidth;
      this.right = centerPoint.x + halfWidth;
      this.top = centerPoint.y - halfHeight;
      this.bottom = centerPoint.y + halfHeight;
    }
    // 取得矩形四个角落上的点
    Rectangle.prototype.getCornerPoints = function() {
      return [
        new Point(this.left, this.top),
        new Point(this.right, this.top),
        new Point(this.left, this.bottom),
        new Point(this.right, this.bottom)
      ];
    };

    // 通过一条线得到一个矩形
    // 把线当作矩形的一条对角线
    // 如果线是平行坐标轴时，则把线的长度当作矩形的长宽，线的中点还是矩形的中点
    Rectangle.lineToRectangle = function(line) {
      var width, height;

      // 是一条与坐标轴平行的线
      if (line.isParallel) {
        width = Math.abs(line.p1.x - line.p2.x || line.p1.y - line.p2.y);
        height = width;
      } else {
        width = Math.abs(line.p2.x - line.p1.x);
        height = Math.abs(line.p2.y - line.p1.y);
      }

      return new Rectangle(line.getCenterPoint(), width, height);
    };


    // 判断点是否在矩形内（在矩形边界上不算）
    Rectangle.prototype.containsPoint = function(point) {
      return point.x > this.left && point.x < this.right &&
        point.y > this.top && point.y < this.bottom;
    };


    // 判断两个矩形是否有交集（边重合不算）
    // 注意：一个矩形可能完全包含另一个矩形，也可能两者的端点都在外面
    Rectangle.prototype.crossWith = function(rectangle) {
      var cross = false, self = this;

      // 1、 一个矩形的中点如果在另一个矩形中，则肯定相交
      if (self.containsPoint(rectangle.centerPoint) || rectangle.containsPoint(self.centerPoint)) {
        return true;
      }

      // 2、判断一个矩形的四个点中是否有一个在另一个矩形内部
      [self, rectangle].forEach(function (r1, index) {
        var r2 = index === 0 ? rectangle : self;
        r1.getCornerPoints().forEach(function(point) {
          if (r2.containsPoint(point)) {
            cross = true;
            return false;
          }
        });
        if (cross) {
          return false;
        }
      });

      return cross;
    };




    /*
     在一个指定大小的矩形内生成指定数量的点
       padding: 平面四边要留出多少空白来不生成任何的点
       minHorizontalDistance: 两点之间最短的水平距离
       minVerticalDistance: 两点之间最短的垂直距离
     */
    Rectangle.prototype.generatePoints = function(padding, minHorizontalDistance, minVerticalDistance) {
      var minX = this.left + padding,
        maxX = this.right - padding,
        minY = this.top + padding,
        maxY = this.bottom - padding,
        x, y, points = [];
      for (y = minY + 1; y < maxY; y += minVerticalDistance) {
        for (x = minX + 1; x < maxX; x += minHorizontalDistance) {
          points.push(new Point(x, y));
        }
      }

      return points;
    };



    return {
      Point: Point,
      Line: Line,
      Vector: Vector,
      Rectangle: Rectangle,

      // 常用常数
      SQRT_2_DIVISION_2: SQRT_2_DIVISION_2
    };

  });
