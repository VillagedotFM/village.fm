Template.controls.events({
  "click .sr-controls__play--play": function(event, template){
    let currentPost = appBodyRef.nowPlaying.get();
    if (currentPost.type === 'youtube') {
      yt.player.playVideo();
    } else {
      appBodyRef.scplayer.get().play();
    }
  },
  "click .sr-controls__play--paused": function(event, template){
    let currentPost = appBodyRef.nowPlaying.get();
    if (currentPost.type === 'youtube') {
      yt.player.pauseVideo();
    } else {
      appBodyRef.scplayer.get().pause();
    }
  }
});
