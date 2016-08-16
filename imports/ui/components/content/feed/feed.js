import './feed.html';
import './helpers.js';
import './events.js';

createSCPlayer = function(post, index) {  //Initialize all Soundcloud players
  SC.stream('/tracks/'+post.vidId).then(function(player){
    window['scplayer-'+post._id] = player;

    appBodyRef.videosReady.push(index);

    let allPosts = appBodyRef.postOrder.get();

    //Pause other posts, set this as nowPlaying, set state to playing, and set prev/next posts
    window['scplayer-'+post._id].on('play', function(event){

      Meteor.call('listenPost', post._id, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log("Listened!" + post._id);
        }
      });

      pauseEverythingElse(post._id);
      appBodyRef.nowPlaying.set(post);
      appBodyRef.state.set(1);
      appBodyRef.prevPost.set(allPosts[index - 1]);
      appBodyRef.nextPost.set(allPosts[index + 1]);
    });

    window['scplayer-'+post._id].on('pause', function(event){
      appBodyRef.state.set(2);
    });

    window['scplayer-'+post._id].on('finish', function(event){
      appBodyRef.state.set(0);
      window['scplayer-'+post._id].seek(0);     //Reset to 0 incase user wants to replay

      let nextPost = appBodyRef.nextPost.get();

      if (nextPost) { //Play next post if it exists
        if (nextPost.type === 'youtube') {
          window['ytplayer-' + nextPost._id].playVideo();
        } else {
          window['scplayer-' + nextPost._id].play();
        }
        appBodyRef.nowPlaying.set(nextPost);
      }
    });
  });
}

createYTPlayer = function(post, index) {
  let allPosts = appBodyRef.postOrder.get();
  let yt_id = post.vidId;
  let name = 'ytplayer-'+ post._id;

  onPlayerReady = function(event) {
    console.log('ready');
    appBodyRef.videosReady.push(index);
  }

  onPlayerStateChange = function(event) {
    if(event.data === 0){           //ENDED
      appBodyRef.state.set(0);      //Keep track of video state (playing/paused)
      let nextPost = appBodyRef.nextPost.get();

      if (nextPost) { //Play next post if it exists
        if (nextPost.type === 'youtube') {
          window['ytplayer-' + nextPost._id].playVideo();
        } else {
          window['scplayer-' + nextPost._id].play();
        }
        appBodyRef.nowPlaying.set(nextPost);
      }
    } else if(event.data === 1){    //PLAYING

      Meteor.call('listenPost', post._id, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log("Listened!" + post._id);
        }
      });

      appBodyRef.state.set(1);      //Keep track of video state (playing/paused)
      pauseEverythingElse(post._id);
      appBodyRef.prevPost.set(allPosts[index - 1]);
      appBodyRef.nextPost.set(allPosts[index + 1]);
      appBodyRef.nowPlaying.set(post);
    } else if (event.data === 2) {  //PAUSED
      appBodyRef.state.set(2);      //Keep track of video state (playing/paused)
    }

  }

  if (window[name].l) {
    console.log(window[name].l);
  } else {
    window[name] = new YT.Player(name, {
      events: {
        videoId: yt_id,
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
  }
}

Template.feed.onCreated(function feedOnCreated() {
  const feedRef = this;

  //Populate iframes
  feedRef.autorun(function () {
      let orderedPosts = appBodyRef.displayPosts.get();

      var checkYT = setInterval(function () {
        if (typeof YT != 'undefined' && YT.loaded) {
          _.each(orderedPosts, function(post, index) {
            if (post.type === 'youtube') {
              createYTPlayer(post, index);
            }
          });

          clearInterval(checkYT);
        }
      }, 100);
  });

  //Load youtube iframe api async
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);



  //Set Pagination (sort of):
  //Start by displaying 3 posts, then add 3 everytime the user scrolls to the bottom
  //of the page until there are none left
  feedRef.autorun(function () {
    SC.initialize({
      client_id: 'aee8647bad94cb6e201efcf6bee4224d'
    });

    let posts = appBodyRef.postOrder.get();

    // Global function to check and move if selected post
    GlobalClient.checkAndMoveSelectedPost(posts);

    //Number of posts to display after a user scrolls to the bottom.
    //Their first visit = 3, scroll to the bottom once = 6, twice = 9...
    let lastIndex = (appBodyRef.bottomHits.get() * 3) + 3;

    if (lastIndex < posts.length) { //make sure there are enough posts
      appBodyRef.displayPosts.set(posts.slice(0, lastIndex));
    } else {
      appBodyRef.displayPosts.set(posts.slice(0, posts.length));
    }
  });


  //Populate SC iframes
  feedRef.autorun(function () {
    if (appBodyRef.displayPosts.get().length > 0) {  //if feed has posts
      let allPosts = appBodyRef.postOrder.get();

      _.each(allPosts, function(post, index) {
        if (post.type === 'soundcloud') {
            createSCPlayer(post, index);
        }
      });
    }
  });
});
