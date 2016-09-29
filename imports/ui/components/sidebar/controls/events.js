Template.controls.events({
  "click .sr-controls__play": function(event, template){
    let currentPost;
    let state = appBodyRef.state.get();
    let nowPlaying = appBodyRef.nowPlaying.get();
    //If no post is current selected, play the first
    if (nowPlaying) {
      currentPost = nowPlaying;
    } else {
      currentPost = appBodyRef.postOrder.get()[0];
    }

    if (currentPost.type === 'youtube') {
      if (nowPlaying && window['ytplayer']) {
        if (state === 1) {
          appBodyRef.state.set(2);
          window['ytplayer'].pauseVideo();
        } else {
          appBodyRef.state.set(1);
          window['ytplayer'].playVideo();
        }
      } else {
        appBodyRef.nowPlaying.set(currentPost);
      }
    } else {
      if (state === 1) {
        appBodyRef.state.set(2);
        window['scplayer-' + currentPost._id].pause();
      } else {
        appBodyRef.nowPlaying.set(currentPost);
        appBodyRef.state.set(1);
        window['scplayer-' + currentPost._id].play();
      }
    }

    mixpanel.track('Clicked play button', {
      area: 'Controls'
    });
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
        window['ytplayer'].seekTo(0);
      } else {
        window['scplayer-'+currentPost._id].seek(0);
      }
    } else {
      //go back a post if there is a prevPost
      if (prevPost) {
        if (prevPost.type === 'youtube') {
          appBodyRef.nowPlaying.set(prevPost);
        } else {
          if (typeof window['scplayer-' + prevPost._id] === 'undefined') {
            let prevPrev = order[index[0] - 2];
            if (prevPrev.type === 'youtube') {
              appBodyRef.nowPlaying.set(prevPrev);
            } else {
              appBodyRef.nowPlaying.set(prevPrev);
              appBodyRef.state.set(1);
              window['scplayer-' + prevPrev._id].play();
            }
          } else {
            appBodyRef.nowPlaying.set(prevPost);
            appBodyRef.state.set(1);
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
        appBodyRef.nowPlaying.set(nextPost);
      } else {
        if (typeof window['scplayer-' + nextPost._id] === 'undefined') {
          let nextNext = order[index[0] + 2];
          if (nextNext.type === 'youtube') {
            appBodyRef.nowPlaying.set(nextNext);
          } else {
            appBodyRef.nowPlaying.set(nextNext);
            appBodyRef.state.set(1);
            window['scplayer-' + nextNext._id].play();
          }
        } else {
          appBodyRef.nowPlaying.set(nextPost);
          appBodyRef.state.set(1);
          window['scplayer-' + nextPost._id].play();
        }
      }
    }

    mixpanel.track('Clicked Next Track');
  }
});
