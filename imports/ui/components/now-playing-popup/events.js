Template.now_playing_popup.events({
  'click .now-playing__arrow-down': function(event, template){
      $('.now-playing').hide();
      $('.bottom-player').show();
      $('html, body').removeClass('overflow-hidden');
      $('.main, .header').removeClass('blur');
  },
  'click .now-playing__view-post': function(event, template){
    $('.now-playing').hide();
    $('.bottom-player').show();
    $('html, body').removeClass('overflow-hidden');
    $('.main, .header').removeClass('blur');
    $('.us-mobile').hide();
    $('.sidebar').hide();
    $('.container').show();
  },
  "click .player__controls__play--play": function(event, template){
    var currentPost;
    //If no post is current selected, play the first
    if (appBodyRef.nowPlaying.get()) {
      currentPost = appBodyRef.nowPlaying.get();
    } else {
      currentPost = appBodyRef.displayPosts.get()[0];
    }

    if (currentPost.type === 'youtube') {
      window['ytplayer'].playVideo();
    } else {
      window['scplayer-' + currentPost._id].play();
    }
  },
  "click .player__controls__play--paused": function(event, template){
    let currentPost = appBodyRef.nowPlaying.get();
    if (currentPost.type === 'youtube') {
      window['ytplayer'].pauseVideo();
    } else {
      window['scplayer-' + currentPost._id].pause();
    }
  },
  "click .player__controls__prev": function(event, template){
    let currentPost = appBodyRef.nowPlaying.get();
    let prevPost = appBodyRef.prevPost.get();
    let completed = appBodyRef.completed.get();

    if (completed > 5) {
      //seek to 0 if more than 5 seconds have passed
      if (currentPost.type === 'youtube') {
        window['ytplayer'].seekTo(0);
      } else {
        window['scplayer-'+currentPost._id].seek(0);
      }
    } else {
      //go back a post if there is a prevPost
      if (prevPost) {

        if (prevPost.type === 'youtube') {
          window['ytplayer'].playVideo();
        } else {
          window['scplayer-' + prevPost._id].play();
        }
      }
    }
  },
  "click .player__controls__next": function(event, template){
    let currentPost = appBodyRef.nowPlaying.get();
    let nextPost = appBodyRef.nextPost.get();

    if (nextPost) {

      $('.post__video-play#'+nextPost._id).hide();
      if (nextPost.type === 'youtube') {
        window['ytplayer'].playVideo();
      } else {
        window['scplayer-' + nextPost._id].play();
      }
    }
  }
});
