Template.controls.events({
  "click .sr-controls__play--play": function(event, template){
    var currentPost;
    //If no post is current selected, play the first
    if (appBodyRef.nowPlaying.get()) {
      currentPost = appBodyRef.nowPlaying.get();
    } else {
      currentPost = appBodyRef.displayPosts.get()[0];
    }

    if (currentPost.type === 'youtube') {
      yt0.player.playVideo();
    } else {
      window['scplayer-' + currentPost._id].play();
    }
  },
  "click .sr-controls__play--paused": function(event, template){
    let currentPost = appBodyRef.nowPlaying.get();
    if (currentPost.type === 'youtube') {
      yt0.player.pauseVideo();
    } else {
      window['scplayer-' + currentPost._id].pause();
    }
  }
});
