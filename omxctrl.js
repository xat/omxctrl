var exec = require('child_process').exec,
  EventEmitter = require('events').EventEmitter,
  util = require('util');

var defaults = ['-o hdmi'];

var STATES = {
  PLAYING: 0,
  PAUSED: 1,
  IDLE: 2
};

var keys = {
  decreaseSpeed: '1',
  increaseSpeed: '2',
  previousAudioStream: 'j',
  nextAudioStream: 'k',
  previousChapter: 'i',
  nextChapter: 'o',
  previousSubtitleStream: 'n',
  nextSubtitleStream: 'm',
  toggleSubtitles: 's',
  decreaseSubtitleDelay: 'd',
  increaseSubtitleDelay: 'f',
  pause: 'p', // toggle between pause and play
  stop: 'q',
  decreaseVolume: '-',
  increaseVolume: '+',
  seekForward: "\x5b\x43",
  seekBackward: "\x5b\x44",
  seekFastForward: "\x5b\x41",
  seekFastBackward: "\x5B\x42"
};

var omx = function() {
  if (!(this instanceof omx)) return new omx();
  this.state = STATES.IDLE;
};

util.inherits(omx, EventEmitter);

// start playing.. before make sure to
// shutdown any existing instance
omx.prototype.play = function(file, opts) {
  // toggle between play and pause if no file
  // was passed in.
  if (!file) return this.pause();

  // quit any existing instance
  this.stop();

  if (this.state === STATES.IDLE) {
    return this.init(file, opts);
  }

  // init asap
  this.once('ended', function() {
    this.init(file, opts);
  }.bind(this));
};

// fire up omxplayer
omx.prototype.init = function(file, opts) {
  var cmdOptions = (opts || defaults).join(' ');
  this.player = exec('omxplayer '+cmdOptions+' "'+file+'"');
  this.emit('playing', file);
  this.state = STATES.PLAYING;

  this.player.on('exit', function() {
    this.state = STATES.IDLE;
    this.player = null;
    this.emit('ended');
  }.bind(this));
};

// send a key command to omxplayer
omx.prototype.send = function(key) {
  if (!this.player || this.state === STATES.IDLE) return;
  this.player.stdin.write(key);
};

// check the current state
omx.prototype.getState = function() {
  return this.state;
};

omx.prototype.pause = function() {
  if (this.state === STATES.IDLE) return;
  this.state = (this.state === STATES.IDLE) ? STATES.PLAYING : STATES.PAUSED;
  this.send('p');
};

// build some nice methods for interacting
// with the player
for (var method in keys) {
  (function(key) {
    omx.prototype[method] = function() {
      this.send(key);
    };
  })(keys[method]);
}

module.exports = omx();