angular.module('mora.ui')
  .factory('Media', function ($window) {

    var doc = $window.document;


    /*
     播放器
     video: { preload: 'metadata', controls: true },
     audio: { preload: 'none' }
     */
    function Player(type, src, cfg) {
      var player,
        className = 'media-' + type.toLowerCase(),
        isMediaSrc = typeof src === 'string',
        defaultCfg = {
          preload: 'none'
        };

      if (isMediaSrc) {
        player = doc.createElement(ng.capitalize(type));
        player.className = className;
        player.style.display = 'none';
      } else {
        player = src;
        player.classList.add(className);
      }


      ng.extend(player, defaultCfg, cfg);
      player.ref = this;
      this.player = player;

      if (isMediaSrc) {
        doc.body.appendChild(player);
        this.player.src = src;
      }

      this.isPlay = false;
    }

    Player.prototype = {
      volume   : function(val) {
        return val ? (this.player.volume = val) : this.player.volume;
      },
      isPlaying: function() {
        return this.isPlay;
      },
      play     : function() {
        this.isPlay = true;
        this.player.play();
      },
      pause    : function() {
        this.isPlay = false;
        this.player.pause();
      },
      toggle   : function() {
        if (this.isPlay) {
          this.pause();
        } else {
          this.play();
        }
      },
      destroy: function() {
        this.pause();
        this.player.ref = null;
        var parent = this.player.parentNode;
        if (parent) {
          parent.removeChild(this.player);
        }
        this.player = null;
      },
      time     : function(val) {
        return val ? (this.player.currentTime = val) : this.player.currentTime;
      },
      totalTime: function() {
        return this.player.duration;
      },
      on: function(type, func) {
        var
          self = this,
          types = type.split(/\s+/),
          handler = function(e) {
            // chrome bug， 音频结束的时候同时会触发 paused 和 ended 事件
            if (self.player.ended && e.type === 'pause') {
              return;
            }
            func.apply(self, [].slice.call(arguments));
          };

        types.forEach(function(type) {
          self.player.addEventListener(type, handler, false);
        });
      }
    };


    function pausePlayersExcept(players, player) {
      players.forEach(function(p) {
        if (p !== player) {
          p.pause();
        }
      });
    }

    // isSinglePlayer 为 true 表示同时只允许一个 play 在播放
    Player.setupPlayers = function(type, selector, opts, isSinglePlayer) {
      var players = [],
        els = [].slice.call(doc.querySelectorAll(selector));
      els.forEach(function(control) {
        var player = new Player(type, control.dataset.src, opts);
        player.on('playing', function() {
          control.classList.add('playing');
        });
        player.on('pause ended', function() {
          control.classList.remove('playing');
        });
        control.addEventListener('click', function() {
          player.toggle();
          if (isSinglePlayer && player.isPlaying()) {
            pausePlayersExcept(players, player);
          }
        }, false);
        players.push(player);
      });
      return players;
    };

    return {
      AudioPlayer: function(src, cfg) {
        return new Player('Audio', src, cfg);
      },
      VideoPlayer: function(src, cfg) {
        return new Player('Video', src, cfg);
      },

      setupAudioPlayers: function(selector, audioOpts, isSinglePlayer) {
        return Player.setupPlayers('Audio', selector, audioOpts, isSinglePlayer);
      },

      setupVideoPlayers: function(selector, audioOpts, isSinglePlayer) {
        return Player.setupPlayers('Video', selector, audioOpts, isSinglePlayer);
      },

      stopAllMedias: function(destroy) {
        [].slice.call(doc.querySelectorAll('audio, video')).forEach(function(el) {
          if (el.ref) {
            el.ref.pause();
            if (destroy) {
              el.ref.destroy();
            }
          }
        });
      }
    };
  });
