import { YTPlayer } from 'meteor/hpx7:youtube-iframe-player';

import './feed.html';
import './helpers.js';
import './events.js';

//initialize 50 youtube iframes here because I can't set them programmatically anywhere so fuck it
for(var i = 0; i < 50; i++) {
  let name = 'yt'+i;  //yt0 - yt49
  window[name] = new YTPlayer(name, {});
}

//Grab the next open iframe (initialized on line 8)
//If all 50 are populated, grab the smallest one that isn't playing
window.getNextYTPlayer = function() {
  for(var i = 0; i < 50; i++) {
    let name = 'yt'+i;  //yt0 - yt49
    //Make sure the iframe is empty
    if (window[name].player) {
      if (i === 49) {
        return 'full'; //findNonPlayingYTPlayer()
      }
      continue;
    } else {
      return {
        ytplayer: window[name],
        id: name
      }
    }
  }
}


Template.feed.onRendered(function feedOnRendered() {
  const feedRef = this;

  //Set Pagination (sort of):
  //Start by displaying 3 posts, then add 3 everytime the user scrolls to the bottom
  //of the page until there are none left
  feedRef.autorun(function () {
    SC.initialize({
      client_id: 'aee8647bad94cb6e201efcf6bee4224d'
    });

    let posts = appBodyRef.postOrder.get().fetch();

    //Number of posts to display after a user scrolls to the bottom.
    //Their first visit = 3, scroll to the bottom once = 6, twice = 9...
    let lastIndex = (appBodyRef.bottomHits.get() * 3) + 3;

    if (lastIndex < posts.length) { //make sure there are enough posts
      appBodyRef.displayPosts.set(posts.slice(0, lastIndex));
    } else {
      appBodyRef.displayPosts.set(posts.slice(0, posts.length));
    }
  });


  //Populate iframes
  feedRef.autorun(function () {
    if (appBodyRef.displayPosts.get().length > 0) {  //if feed has posts
      let orderedPosts = appBodyRef.displayPosts.get();

      _.each(orderedPosts, function(post, index) {
        if (post.type === 'youtube') {
          let yt_id = post.vidId;
          let yt = getNextYTPlayer().ytplayer; //Grab open iframe

          if (yt.ready()) {
            //Add index to array of videos that are ready
            appBodyRef.videosReady.push(index);

            yt.player.cueVideoById(yt_id);        //Cue up video in iframe

            yt.player.setSize(479, 270);

            yt.player.addEventListener('onStateChange', function (event) {
              if(event.data === 0){           //ENDED
                //TODO: start next song if there is one
              } else if(event.data === 1){    //PLAYING
                appBodyRef.nowPlaying.set(post);
              }

              let state = event.data;
              appBodyRef.state.set(state);  //Keep track of video state (playing/paused)

              //Youtube doesn't have dynamic value so ping it multiple times per second to get updated value
              setInterval(function(){ //Track video progress for scrubber
                var completed = yt.player.getCurrentTime();
                appBodyRef.completed.set(completed)
              }, 100);
            });
          }
        }
      });
    }
  });


  //Populate SC iframes
  feedRef.autorun(function () {
    console.log('run');
    if (appBodyRef.displayPosts.get().length > 0) {  //if feed has posts
      let orderedPosts = appBodyRef.displayPosts.get();

      _.each(orderedPosts, function(post, index) {
        if (post.type === 'soundcloud') {
          SC.stream('/tracks/'+post.vidId).then(function(player){
            window['scplayer-'+post._id] = player;

            appBodyRef.videosReady.push(index);

            window['scplayer-'+post._id].on('play', function(event){
              appBodyRef.nowPlaying.set(post);
              appBodyRef.state.set(1);
            });

            window['scplayer-'+post._id].on('pause', function(event){
              appBodyRef.state.set(2);
            });

            window['scplayer-'+post._id].on('finish', function(event){
              appBodyRef.state.set(0);
              window['scplayer-'+post._id].seek(0);
              //TODO: go to next song if there is one
            });
          });
        }
      });
    }
  });
});
