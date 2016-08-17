Template.controls.helpers({
  playOrPause() {
    let nowPlaying = appBodyRef.nowPlaying.get();
    let state = appBodyRef.state.get();
    let time = appBodyRef.completed.get();
    if (nowPlaying) {
      // if (nowPlaying.type === 'youtube') {
      //   if (window['ytplayer-'+ nowPlaying._id].getPlayerState() === 1){
      //     return 'sr-controls__play--paused';
      //   } else {
      //     return 'sr-controls__play--play';
      //   }
      // } else {
      //   return window['scplayer-'+ nowPlaying._id].isPlaying() ? 'sr-controls__play--paused' : 'sr-controls__play--play';
      // }
      console.log(window['state-'+nowPlaying._id]);
      return window['state-'+nowPlaying._id] === 1 ? 'sr-controls__play--paused' : 'sr-controls__play--play';
    }
  }
});
