Template.controls.events({
  "click .sr-controls__play--play": function(event, template){
    var currentPost;
    //If no post is current selected, play the first
    if (appBodyRef.nowPlaying.get()) {
      currentPost = appBodyRef.nowPlaying.get();
    } else {
      currentPost = appBodyRef.postOrder.get()[0];
    }
    
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
