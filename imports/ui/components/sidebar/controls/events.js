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
      if (window['ytplayer-'+currentPost._id]) {
        window['ytplayer-'+currentPost._id].playVideo();
      } else {
        appBodyRef.loadIframe.push(currentPost);
        appBodyRef.nowPlaying.set(currentPost);
      }
    } else {
      window['scplayer-' + currentPost._id].play();
    }

    mixpanel.track('Clicked play button', {
      area: 'Controls'
    });
  },
  "click .sr-controls__play--paused": function(event, template){
    let currentPost = appBodyRef.nowPlaying.get();
    if (currentPost.type === 'youtube') {
      window['ytplayer-' + currentPost._id].pauseVideo();
    } else {
      window['scplayer-' + currentPost._id].pause();
    }
    appBodyRef.isPlaying.set(false);
  },
  "click .sr-controls__prev": function(event, template){
    let currentPost = appBodyRef.nowPlaying.get();
    let order = appBodyRef.postOrder.get();
    let index = $.map(order, function(post, index) {
      if(post._id === currentPost._id) {
        return index;
      }
    });

    let prevPost = order[index[0]-1];
    console.log(prevPost);
    console.log(index[0]);
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
          if (window['ytplayer-'+prevPost._id]) {
            window['ytplayer-'+prevPost._id].playVideo();
          } else {
            appBodyRef.loadIframe.push(prevPost);
            appBodyRef.nowPlaying.set(prevPost);
          }
        } else {
          if (typeof window['scplayer-' + prevPost._id] === 'undefined') {
            let prevPrev = order[index[0] - 2];
            if (prevPrev.type === 'youtube') {
              if (window['ytplayer-'+prevPrev._id]) {
                window['ytplayer-'+prevPrev._id].playVideo();
              } else {
                appBodyRef.loadIframe.push(prevPrev);
                appBodyRef.nowPlaying.set(prevPrev);
              }
            } else {
              window['scplayer-' + prevPrev._id].play();
            }
          } else {
            window['scplayer-' + prevPost._id].play();
          }
        }
      }
    }

    mixpanel.track('Clicked Previous Track');
  },
  "click .sr-controls__next": function(event, template){
    let currentPost = appBodyRef.nowPlaying.get();
    let order = appBodyRef.postOrder.get();
    let index = $.map(order, function(post, index) {
      if(post._id === currentPost._id) {
        return index;
      }
    });

    let nextPost = order[index[0]+1];
    console.log(nextPost);
    console.log(index[0]);

    if (nextPost) {
      if (nextPost.type === 'youtube') {
        if (window['ytplayer-'+nextPost._id]) {
          window['ytplayer-'+nextPost._id].playVideo();
        } else {
          appBodyRef.loadIframe.push(nextPost);
          appBodyRef.nowPlaying.set(nextPost);
        }
      } else {
        if (typeof window['scplayer-' + nextPost._id] === 'undefined') {
          let nextNext = order[index[0] + 2];
          if (nextNext.type === 'youtube') {
            if (window['ytplayer-'+nextNext._id]) {
              window['ytplayer-'+nextNext._id].playVideo();
            } else {
              appBodyRef.loadIframe.push(nextNext);
              appBodyRef.nowPlaying.set(nextNext);
            }
          } else {
            window['scplayer-' + nextNext._id].play();
          }
        } else {
          window['scplayer-' + nextPost._id].play();
        }
      }
    }

    mixpanel.track('Clicked Next Track');
  }
});
