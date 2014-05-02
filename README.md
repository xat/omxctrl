## omxctrl

This is a simple omxplayer wrapper for node. omxplayer is a commandline videoplayer
which is often used with an raspberry pi.

### Usage

```javascript

var omx = require('omxctrl');


omx.play('whatever.mp4'); // Start Playback
omx.stop(); // kill the omxplayer instance

// While a Video is playing the following self-explaining
// methods can be used

omx.decreaseSpeed();
omx.increaseSpeed();
omx.previousAudioStream();
omx.nextAudioStream();
omx.previousChapter();
omx.nextChapter();
omx.previousSubtitleStream();
omx.nextSubtitleStream();
omx.toggleSubtitles();
omx.decreaseSubtitleDelay();
omx.increaseSubtitleDelay();
omx.pause(); // toggle between pause and play
omx.decreaseVolume();
omx.increaseVolume();
omx.seekForward();
omx.seekBackward();
omx.seekFastForward();
omx.seekFastBackward();

// There are also some events
// you can react to

omx.on('playing', function(filename) {
    // Notice that this will only get triggered
    // after a new file starts playing. Not
    // after pause/play.
    console.log('playing: ', filename);
});

omx.on('ended', function() {
    console.log('playback has ended');
});

```

### Installation

```
npm install omxctrl
```



## License
Copyright (c) 2014 Simon Kusterer
Licensed under the MIT license.