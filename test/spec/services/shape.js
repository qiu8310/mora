'use strict';

describe('Service: Shape', function () {

  // load the service's module
  beforeEach(module('moraApp'));

  // instantiate service
  var Shape, Line, Point, Rectangle, Vector;
  beforeEach(inject(function (_Shape_) {
    Shape = _Shape_;
    Line = Shape.Line;
    Point = Shape.Point;
    Rectangle = Shape.Rectangle;
    Vector = Shape.Vector;
  }));



  it('should do supply Point/Line/Rectangle', function () {
    expect(!!Shape).toBe(true);
    expect(!!Point).toBe(true);
    expect(!!Line).toBe(true);
    expect(!!Rectangle).toBe(true);
  });


  it('should support Shape.Point class', function() {
    var p = new Point(1, 3);
    expect(p.x).toBe(1);
    expect(p.y).toBe(3);

    p = new Point(0, 0);
    expect(p.x).toBe(0);
    expect(p.y).toBe(0);
  });


  it('should support Shape.Line class', function() {
    var l1, l2;

    l1 = new Line(new Point(1, 3), new Point(6, 3));
    expect(l1.isParallelX).toBe(true);
    expect(l1.isParallelY).toBe(false);
    expect(l1.isParallel).toBe(true);
    expect(l1.isBackslash).toBe(false);
    expect(l1.getCenterPoint()).toEqual(new Point(3.5, 3));

    l2 = new Line(new Point(1, 3), new Point(1, 6));
    expect(l2.isParallelX).toBe(false);
    expect(l2.isParallelY).toBe(true);
    expect(l2.isParallel).toBe(true);
    expect(l2.isBackslash).toBe(false);
    expect(l2.getCenterPoint()).toEqual(new Point(1, 4.5));

  });


  it('should support Shape.Rectangle', function() {
    var r = new Rectangle(new Point(0, 0), 10, 6), r1, r2;

    expect(r.centerPoint).toEqual(new Point(0, 0));
    expect(r.width).toEqual(10);
    expect(r.height).toEqual(6);

    var p1 = new Point(-5, -3),
      p2 = new Point(5, -3),
      p3 = new Point(-5, 3),
      p4 = new Point(5, 3);
    expect(r.left).toBe(-5);
    expect(r.right).toBe(5);
    expect(r.top).toBe(-3);
    expect(r.bottom).toBe(3);
    expect(r.getCornerPoints()).toEqual([p1, p2, p3, p4]);


    // lineToRectangle
    r1 = Rectangle.lineToRectangle(new Line(new Point(-4, 0), new Point(4, 0)));
    expect(r1.left).toBe(-4);
    expect(r1.bottom).toBe(4);


    r2 = Rectangle.lineToRectangle(new Line(new Point(0, 2), new Point(4, -2)));
    expect(r2.centerPoint).toEqual(new Point(2, 0));
    expect(r2.right).toBe(4);
    expect(r2.top).toBe(-2);

    // containsPoint
    expect(r1.containsPoint(new Point(4, 4))).toBe(false);
    expect(r1.containsPoint(new Point(-5, -5))).toBe(false);
    expect(r1.containsPoint(new Point(3.9, 3.9))).toBe(true);

    // crossWith
    // 完全包含的情况
    expect(r1.crossWith(r2)).toBe(true);
    expect(r2.crossWith(r1)).toBe(true);

    // 有交叉，但相互之间没有一个点在另一个矩形中
    expect(r1.crossWith(r)).toBe(true);
    expect(r.crossWith(r1)).toBe(true);


    // 有一个点在另一个矩形内
    var r3 = new Rectangle(new Point(5, 5), 3, 3);
    expect(r1.crossWith(r3)).toBe(true);
    expect(r3.crossWith(r1)).toBe(true);

    // 没交点
    expect(r2.crossWith(r3)).toBe(false);
    expect(r3.crossWith(r2)).toBe(false);


  });


  it('should support two line cross', function() {
    var l1 = new Line(new Point(-2, 0), new Point(2, 0));

    // 相交
    expect(l1.crossWith(new Line(new Point(0, -2), new Point(0, 2)))).toBe(true);
    expect(l1.crossWith(new Line(new Point(-2, -2), new Point(2, 2)))).toBe(true);

    // 有一点在 l1 上
    expect(l1.crossWith(new Line(new Point(0, 0), new Point(2, 2)))).toBe(true);

    // 重合
    expect(l1.crossWith(new Line(new Point(-4, 0), new Point(4, 0)))).toBe(true);

    // 不相交也不重合
    expect(l1.crossWith(new Line(new Point(1, 1), new Point(2, 2)))).toBe(false);
    expect(l1.crossWith(new Line(new Point(3, 3), new Point(6, 6)))).toBe(false);
    expect(l1.crossWith(new Line(new Point(-1, -1), new Point(-2, -2)))).toBe(false);
    expect(l1.crossWith(new Line(new Point(-4, -4), new Point(-2, -2)))).toBe(false);

    expect(l1.crossWith(new Line(new Point(-1, 0.5), new Point(100, 100)))).toBe(false);
    expect(l1.crossWith(new Line(new Point(-2.1, 0.1), new Point(-2.1, -0.1)))).toBe(false);

  });



  it('should support two line join', function() {
    var l1 = new Line(new Point(-2, 0), new Point(2, 0));

    expect(l1.joinWith(new Line(new Point(2, 0), new Point(3, 3)))).toBe(true);
    expect(l1.joinWith(new Line(new Point(-2, 0), new Point(3, 3)))).toBe(true);
    expect(l1.joinWith(new Line(new Point(-2, 0), new Point(-6, 0)))).toBe(true);

    expect(l1.joinWith(new Line(new Point(-2, 0), new Point(2, 0)))).toBe(false);
    expect(l1.joinWith(new Line(new Point(-2, 0), new Point(6, 0)))).toBe(false);

  });

});
