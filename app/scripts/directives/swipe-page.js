angular.module('mora.ui')
  .directive('swipePage', function (Env) {
    return {
      restrict: 'C',
      link: function(scope, element, attrs) {

        var win = Env.win,
          el = element[0],
          pageEls = [].slice.call(el.children),
          pageElIndex = 0,
          pageElLen = pageEls.length,
          supportTouch = 'ontouchstart' in win,
          events;

        // 指定子页面的次数
        if (attrs.swipeChildren) {
          pageElLen = parseInt(attrs.swipeChildren) || pageElLen;
          pageEls = pageEls.slice(0, pageElLen);
        }


        var ACTIVE = 'active',
          INVALID_GAP = 50,  // 如果拖动的距离小于 此值，则不翻页
          INVALID_SPEED = 200,  // 无效拖动时，需要把页面恢复到原始位置所用的时间（ms）
          VALID_SPEED = 500; // 有效拖动时，将页面设置成新状态需要要用的时间（ms）


        var TYPE = {};
        ['SCROLL', 'SCALE'].forEach(function(key) { TYPE[key] = (attrs.swipe || 'scale').toUpperCase() === key; });


        var css = ng.css3;

        function bind(types) {
          types.split(',').forEach(function(type) {
            if (type.indexOf('touch') === 0 && !supportTouch) { return false; }
            el.addEventListener(type, events, false);
          });
        }
        function unbind(types){
          types.split(',').forEach(function(type) {
            if (type.indexOf('touch') === 0 && !supportTouch) { return false; }
            el.removeEventListener(type, events, false);
          });
        }
        function curr() { return pageEls[pageElIndex]; }
        function next() { return pageEls[pageElIndex + 1] || null; }
        function prev() { return pageEls[pageElIndex - 1] || null; }

        function translate (elem, transform, speed, func) {
          if (!elem) { return false; }
          transform = transform || {};

          var pos = (transform.x || 0) + 'px, ' + (transform.y || 0) + 'px';
          var scale = ('scale' in transform) ? transform.scale : 1;

          func = func || 'ease';
          css(elem, 'transitionTimingFunction', speed > 0 ? func : 'no');
          css(elem, 'transitionDuration', (speed || 0) + 'ms');
          css(elem, 'transform', 'translate('+ pos +') scale('+ scale +')');
        }
        function toggleClass (el, cls, allCls) {
          allCls.forEach(function(key) {
            el.classList[cls === key ? 'add' : 'remove'](key);
          });
        }

        var winHeight;
        events = {
          handleEvent: function(e) {
            var target = e.touches && e.touches[0] || e,
              oldPos = this.pos,
              startPos = this.startPos,
              pos;
            e.stopPropagation();
            e.preventDefault();

            this.pos = pos = {
              x: target.pageX,
              y: target.pageY,
              t: Date.now()
            };
            pos.dx = oldPos ? pos.x - oldPos.x : 0;
            pos.dy = oldPos ? pos.y - oldPos.y : 0;
            pos.ax = startPos ? pos.x - startPos.x : 0;
            pos.ay = startPos ? pos.y - startPos.y : 0;

            switch (e.type) {
              case 'touchstart':
              case 'mousedown':
                this.start(e);
                break;

              case 'touchmove':
              case 'mousemove':
                this.move(e);
                break;

              case 'touchend':
              case 'mouseup':
                this.end(e);
                break;

              case 'touchcancel':
              case 'mousecancel':
                this.end(e);
                break;

              default: break;
            }
          },

          reset: function() {
            unbind('mousemove,mousecancel,mouseup,touchmove,touchcancel,touchend');

            var nextEl = next(), prevEL = prev(),
              allElCls = ['page-first-active', 'page-last-active'],
              cls = pageElIndex === 0 ? allElCls[0] : pageElIndex === pageElLen - 1 ? allElCls[1] : '';

            if (nextEl) { nextEl.classList.remove(ACTIVE); }
            if (prevEL) { prevEL.classList.remove(ACTIVE); }
            curr().classList.add(ACTIVE);
            toggleClass(el, cls, allElCls);

            this.startPos = null;
            this.pos = null;
          },
          start: function(e) {
            winHeight = win.document.documentElement.clientHeight;
            bind('mousemove,mousecancel,mouseup,touchmove,touchcancel,touchend');
            this.startPos = this.pos;
          },
          move: function(e) {
            if (!this.startPos) { return this.reset(); }
            var pos, direction, translateY, scale;

            pos = this.pos;
            this.direction = direction = pos.ay < 0 ? 'up' : pos.ay > 0 ? 'down' : false;

            translateY = TYPE.SCALE ? pos.ay / 4 : pos.ay;
            scale = TYPE.SCALE ? (winHeight - Math.abs(translateY)) / winHeight : 1;

            translate(curr(), {scale: scale, y: translateY});
            toggleClass(el, direction, ['up', 'down']);

            css(curr(), 'z-index', 1);
            if (direction === 'up') {
              translate(next(), {scale: 1, y: winHeight + pos.ay});
              css(next(), 'z-index', 2);
            } else if (direction === 'down') {
              translate(prev(), {scale: 1, y: pos.ay - winHeight});
              css(prev(), 'z-index', 2);
            } else {
              translate(next(), {scale: 0, y: winHeight});
              translate(prev(), {scale: 0, y: winHeight});
            }
          },

          end: function(e) {
            var invalid = Math.abs(this.pos.ay) < INVALID_GAP;

            if (this.direction === 'up') {
              if (invalid || !next()) {
                translate(curr(), {}, INVALID_SPEED);
                translate(next(), {y: winHeight}, INVALID_SPEED);
              } else {
                translate(curr(), {y: 0 - winHeight}, VALID_SPEED);
                translate(next(), {y: 0}, VALID_SPEED);
                pageElIndex++;
              }
            } else if (this.direction === 'down') {
              if (invalid || !prev()) {
                translate(curr(), {}, INVALID_SPEED);
                translate(prev(), {y: 0 - winHeight}, INVALID_SPEED);
              } else {
                translate(curr(), {y: winHeight}, VALID_SPEED);
                translate(prev(), {y: 0}, VALID_SPEED);
                pageElIndex--;
              }
            }

            this.reset();
          }
        };

        events.reset();
        bind('touchstart,mousedown');
        win.addEventListener('resize', function() { events.reset(); }, false);
      }
    };
  });