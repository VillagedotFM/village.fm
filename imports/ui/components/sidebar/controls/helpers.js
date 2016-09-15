Template.controls.helpers({
  playOrPause() {
    let nowPlaying = appBodyRef.nowPlaying.get();
    if (nowPlaying) {
      let state = appBodyRef.state.get();
      return state === 1 ? 'sr-controls__play--paused' : 'sr-controls__play--play';
    }
  },
});
