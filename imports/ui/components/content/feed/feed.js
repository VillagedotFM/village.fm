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

    //Pause other posts, set this as nowPlaying, set state to playing, and set prev/next posts
    window['scplayer-'+post._id].on('play', function(event){
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
    });

    window['scplayer-'+post._id].on('finish', function(event){
      window['scplayer-'+post._id].seek(0);     //Reset to 0 incase user wants to replay

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
    });
  });
}

createYTPlayer = function(p) {     //Initialize the yt player
  let post = appBodyRef.nowPlaying.get();
  let yt_id = post.vidId;
  let name = 'ytplayer';

  onPlayerReady = function(event) {
    console.log('ready');
    let post = appBodyRef.nowPlaying.get();
    let mobile = appBodyRef.mobile.get();
    if (post.type === 'youtube') {
      let topy = $('#video-' + post._id).offset().top + 'px';
      $('#ytplayer').show();
      if (mobile) {
        let mobileTopy = ($('#video-' + post._id).offset().top - 60) + 'px';
        $('#ytplayer').css({top: mobileTopy});
      } else {
        $('#ytplayer').css({top: topy});
      }
    } else {
      $('#ytplayer').hide();
    }

    event.target.addEventListener('onStateChange', function(event) {
      let post = appBodyRef.nowPlaying.get();
      if (post.type === 'youtube') {
        appBodyRef.state.set(event.data);           //Keep track of player state

        if(event.data === 0){           //ENDED

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
    let mobile = appBodyRef.mobile.get();

    if (nowPlaying) {
      if (nowPlaying.type === 'youtube') {    //Grab the post and make sure it's youtube
        let topy = $('#video-' + nowPlaying._id).offset().top + 'px';
        $('#ytplayer').show();
        if (mobile) {
          let mobileTopy = ($('#video-' + nowPlaying._id).offset().top - 60) + 'px';
          $('#ytplayer').css({top: mobileTopy});
        } else {
          $('#ytplayer').css({top: topy});
        }
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
      } else {
        $('#ytplayer').hide();
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
