import './controls.html';



Template.controls.helpers({
  playOrPause() {
    let state = appBodyRef.state.get();
    return state === 1 ? 'sr-controls__play--paused' : 'sr-controls__play--play';
  }
});

Template.controls.events({
  "click .sr-controls__play--play": function(event, template){
    yt.player.playVideo();
  },
  "click .sr-controls__play--paused": function(event, template){
    yt.player.pauseVideo();
  }
});
