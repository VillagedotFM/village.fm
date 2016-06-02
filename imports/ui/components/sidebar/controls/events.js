Template.controls.events({
  "click .sr-controls__play--play": function(event, template){
    yt.player.playVideo();
  },
  "click .sr-controls__play--paused": function(event, template){
    yt.player.pauseVideo();
  }
});
