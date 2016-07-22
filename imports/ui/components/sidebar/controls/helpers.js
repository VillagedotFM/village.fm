Template.controls.helpers({
  playOrPause() {
    let state = appBodyRef.state.get();
    return state === 1 ? 'sr-controls__play--paused' : 'sr-controls__play--play';
  },
  hasNext(){
    return appBodyRef.nextPost.get();
  },
  hasPrev(){
    return appBodyRef.prevPost.get();
  }
});
