Template.controls.helpers({
  playOrPause() {
    let nowPlaying = appBodyRef.nowPlaying.get();
    if (nowPlaying) {
      let state = appBodyRef.state.get();
      return window['state-'+nowPlaying._id] === 1 ? 'sr-controls__play--paused' : 'sr-controls__play--play';
    }
  }
});
