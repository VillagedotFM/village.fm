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
      window['ytplayer-' + currentPost._id].playVideo();
    } else {
      window['scplayer-' + currentPost._id].play();
    }
  },
  "click .sr-controls__play--paused": function(event, template){
    let currentPost = appBodyRef.nowPlaying.get();
    if (currentPost.type === 'youtube') {
      window['ytplayer-' + currentPost._id].pauseVideo();
    } else {
      window['scplayer-' + currentPost._id].pause();
    }
  },
  "click .sr-controls__prev": function(event, template){
    let currentPost = appBodyRef.nowPlaying.get();
    let prevPost = appBodyRef.prevPost.get();
    let completed = appBodyRef.completed.get();

    if (completed > 5) {
      //seek to 0 if more than 5 seconds have passed
      if (currentPost.type === 'youtube') {
        window['ytplayer-' + currentPost._id].seekTo(0);
      } else {
        window['scplayer-'+currentPost._id].seek(0);
      }
    } else {
      //go back a post if there is a prevPost
      if (prevPost) {

        if (prevPost.type === 'youtube') {
          window['ytplayer-' + prevPost._id].playVideo();
        } else {
          window['scplayer-' + prevPost._id].play();
        }
      }
    }
  },
  "click .sr-controls__next": function(event, template){
    let currentPost = appBodyRef.nowPlaying.get();
    let nextPost = appBodyRef.nextPost.get();

    if (nextPost) {
      if (nextPost.type === 'youtube') {
        window['ytplayer-' + nextPost._id].playVideo();
      } else {
        window['scplayer-' + nextPost._id].play();
      }
    }
  }
});
