import './feed.html';
import './helpers.js';
import './events.js';
import './rendered.js';

createSCPlayer = function(post) {  //Initialize all Soundcloud players

  if(typeof window['scplayer-'+post._id] !== 'undefined'){
    return;
  }

  SC.stream('/tracks/'+post.vidId).then(function(player){
    window['scplayer-'+post._id] = player;
    let allPosts = appBodyRef.postOrder.get();
    console.log('tally');
    let indexes = $.map(allPosts, function(obj, idx) {
      if(obj._id === post._id) {
        return idx;
      }
    });

    let nextPost = allPosts[indexes[0]+1];

    appBodyRef.videosReady.push(indexes[0]);

    window['scplayer-'+post._id].on('state-change', function(event){
      // console.log(event);
    });

    //Pause other posts, set this as nowPlaying, set state to playing, and set prev/next posts
    window['scplayer-'+post._id].on('play', function(event){
      // appBodyRef.state.set(1);
      pauseEverythingElse(post._id);

      Meteor.call('listenPost', post._id, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log("Listened!" + post._id);
        }
      });

      let checkIfListened = setInterval(function(){
        const isPlaying = appBodyRef.state.get();
        const completed = appBodyRef.completed.get();
        const post = appBodyRef.nowPlaying.get();
        if(post && true == parseInt(completed) > 4){
          mixpanel.track('Listened to a Song', {
            area: 'Playlist',
            postId: post._id
          });
          mixpanel.people.set({
              'dateOfLastListen': new Date().toISOString()
          });
          clearInterval(checkIfListened);
        }
      }, 1000);

      setInterval(function(){
        const isPlaying = appBodyRef.state.get();
        if(isPlaying === 1){
          let completed = appBodyRef.completed.get();
          if(parseInt(completed) > 0 && parseInt(completed) % 60 === 0){
            window.analytics.totalMinutesListened = window.analytics.totalMinutesListened + 1;
            mixpanel.register({
                'totalMinutesListened': window.analytics.totalMinutesListened
            });

            mixpanel.people.increment({
                'totalMinutesListened': 1
            });
          }
        }
      }, 1000);


      /*
       mixpanel.register({
          'totalMinutesListened': appBodyRef.totalMinutesListened
      });

      mixpanel.people.increment({
          'totalMinutesListened': 1
      });
      */

      // appBodyRef.prevPost.set(allPosts[index - 1]);
      // appBodyRef.nextPost.set(allPosts[index + 1]);
    });

    window['scplayer-'+post._id].on('pause', function(event){
      let nowPlaying = appBodyRef.nowPlaying.get();
      if (nowPlaying && nowPlaying._id === post._id) {
        // appBodyRef.state.set(2);
      }
    });

    window['scplayer-'+post._id].on('finish', function(event){
      window['scplayer-'+post._id].seek(0);     //Reset to 0 incase user wants to replay

      // let nextPost = appBodyRef.nextPost.get();

      if (nextPost) { //Play next post if it exists
        if (nextPost.type === 'youtube') {
          if (window['ytplayer-'+nextPost._id]) {
            window['ytplayer-'+nextPost._id].playVideo();
          } else {
            // appBodyRef.loadIframe.push(nextPost);
            appBodyRef.nowPlaying.set(nextPost);
          }
        } else {
          if (typeof window['scplayer-' + nextPost._id] === 'undefined') {
            let nextNext = allPosts[index[0] + 2];
            if (nextNext.type === 'youtube') {
              if (window['ytplayer-'+nextNext._id]) {
                window['ytplayer-'+nextNext._id].playVideo();
              } else {
                // appBodyRef.loadIframe.push(nextNext);
                appBodyRef.nowPlaying.set(nextNext);
              }
            } else {
              window['scplayer-' + nextNext._id].play();
            }
          } else {
            window['scplayer-' + nextPost._id].play();
          }
        }
        appBodyRef.nowPlaying.set(nextPost);
      }
    });
  });
}

createYTPlayer = function(p) {     //Initialize the yt player
  let post = appBodyRef.nowPlaying.get();
  let yt_id = post.vidId;
  let name = 'ytplayer';


  // window['state'] = 0;
  // let allPosts = appBodyRef.postOrder.get();
  // let indexes = $.map(allPosts, function(obj, idx) {
  //   if(obj._id === post._id) {
  //     return idx;
  //   }
  // });
  //
  // let nextPost = allPosts[indexes[0]+1];
  // let prevPost = allPosts[indexes[0]-1];


  onPlayerReady = function(event) {
    console.log('ready');

    event.target.addEventListener('onStateChange', function(event) {
      let post = appBodyRef.nowPlaying.get();
      if (post.type === 'youtube') {
        appBodyRef.state.set(event.data);           //Keep track of player state

        if(event.data === 0){           //ENDED
          // window['state-'+post._id] = 2;

          // let nextPost = appBodyRef.nextPost.get();

          // if (nextPost) { //Play next post if it exists
          //   window['state-'+nextPost._id] = 2;
          //   if (nextPost.type === 'youtube') {
          //     if (window['ytplayer-'+nextPost._id]) {
          //       window['ytplayer-'+nextPost._id].playVideo();
          //     } else {
          //       appBodyRef.loadIframe.push(nextPost);
          //       appBodyRef.nowPlaying.set(nextPost);
          //     }
          //   } else {
          //     if (typeof window['scplayer-' + nextPost._id] === 'undefined') {
          //       let nextNext = allPosts[index[0] + 2];
          //       if (nextNext.type === 'youtube') {
          //         if (window['ytplayer-'+nextNext._id]) {
          //           window['ytplayer-'+nextNext._id].playVideo();
          //         } else {
          //           appBodyRef.loadIframe.push(nextNext);
          //           appBodyRef.nowPlaying.set(nextNext);
          //         }
          //       } else {
          //         window['scplayer-' + nextNext._id].play();
          //       }
          //     } else {
          //       window['scplayer-' + nextPost._id].play();
          //     }
          //   }
          //   // appBodyRef.nowPlaying.set(nextPost);
          // }
        } else if(event.data === 1){    //PLAYING
          if (post.type === 'youtube') {
            pauseEverythingElse(post._id);

            Meteor.call('listenPost', post._id, function(err, data) {
              if (err) {
                console.log(err);
              } else {
                console.log("Listened!" + post._id);
              }
            });


            let checkIfListened = setInterval(function(){
              const isPlaying = appBodyRef.state.get();
              const completed = appBodyRef.completed.get();
              const post = appBodyRef.nowPlaying.get();
              if(post && true == parseInt(completed) > 4){
                mixpanel.track('Listened to a Song', {
                  area: 'Playlist',
                  postId: post._id
                });
                mixpanel.people.set({
                    'dateOfLastListen': new Date().toISOString()
                });
                clearInterval(checkIfListened);
              }
            }, 1000);

            setInterval(function(){
              const isPlaying = appBodyRef.state.get();
              if(isPlaying === 1){
                let completed = appBodyRef.completed.get();
                if(parseInt(completed) > 0 && parseInt(completed) % 60 === 0){
                  window.analytics.totalMinutesListened = window.analytics.totalMinutesListened + 1;
                  mixpanel.register({
                      'totalMinutesListened': window.analytics.totalMinutesListened
                  });

                  mixpanel.people.increment({
                      'totalMinutesListened': 1
                  });
                }
              }
            }, 1000);
          }

          // debugger;
          // appBodyRef.prevPost.set(allPosts[index - 1]);
          // appBodyRef.nextPost.set(allPosts[index + 1]);
          // appBodyRef.nowPlaying.set(post);
        } else if (event.data === 2) {  //PAUSED
          // window['state-'+post._id] = 2;
          // if (appBodyRef.nowPlaying.get() !== post) {
          //   window['ytplayer-' + post._id].seekTo(0);
          // }
        }
      }
    });

    window[name].playVideo();         //Play video when ready
  }

  window[name] = new YT.Player(name, {
    height: '270',
    width: '464',
    videoId: yt_id,
    events: {
      'onReady': onPlayerReady,
    }
  });
}

Template.feed.onCreated(function feedOnCreated() {
  const feedRef = this;

  //initialize youtube iframe when first play button is clicked on youtube post
  feedRef.autorun(function(comp){
    let nowPlaying = appBodyRef.nowPlaying.get();

    if (nowPlaying) {
      if (nowPlaying.type === 'youtube') {    //Grab the post and make sure it's youtube
        //If there is no player, initialize with post; if there is, load post
        if (window['ytplayer'] && window['ytplayer'].l) {
          appBodyRef.state.set(-1);
          window['ytplayer'].loadVideoById(nowPlaying.vidId);
        } else {
          //Make sure YT API is loaded
          var checkYT = setInterval(function () {
            if(typeof YT != 'undefined' && YT.loaded){
              if ($('#ytplayer')[0]) {                        //If the iframe is in the DOM
                console.log('ready to load');
                createYTPlayer(nowPlaying);                   //Initialize the player with the post
              }

              clearInterval(checkYT);
            }
          }, 100);
        }
      }
    }
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
    let lastIndex = (appBodyRef.bottomHits.get() * 9) + 9;

    if (lastIndex < posts.length) { //make sure there are enough posts
      appBodyRef.displayPosts.set(posts.slice(0, lastIndex));
    } else {
      appBodyRef.displayPosts.set(posts.slice(0, posts.length));
    }
    // appBodyRef.displayPosts.set(posts);
  });


  //Populate SC iframes
  feedRef.autorun(function () {
    if (appBodyRef.displayPosts.get().length > 0) {  //if feed has posts
      let allPosts = appBodyRef.postOrder.get();

      _.each(allPosts, function(post, index) {
        if (post.type === 'soundcloud') {
            createSCPlayer(post);
        } else {
          appBodyRef.videosReady.push(index);
        }
      });
    }
  });
});
