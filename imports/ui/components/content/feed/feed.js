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
  //Start by displaying 5 posts, then add 5 everytime the user scrolls to the bottom
  //of the page until there are none left
  feedRef.autorun(function () {
    let posts = appBodyRef.postOrder.get().fetch();

    //Number of posts to display after a user scrolls to the bottom.
    //Their first visit = 5, scroll to the bottom once = 10, twice = 15...
    let lastIndex = (appBodyRef.bottomHits.get() * 5) + 5;

    if (lastIndex < posts.length) { //make sure there are enough posts
      appBodyRef.displayPosts.set(posts.slice(0, lastIndex));
    } else {
      appBodyRef.displayPosts.set(posts.slice(0, posts.length));
    }
  });

  //Populate iframes
  feedRef.autorun(function () {
    $( window ).load(function() {

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
          } else {    //Soundcloud

            let uniqId = 'scplayer-' + post._id;
            console.log(post);

            window[uniqId] = SC.Widget(uniqId);   //initialize sc widget with unique id of iframe

            //load new widget with no extra branding
            window[uniqId].load(post.link, {
              buying: false,
              liking: false,
              download: false,
              sharing: false,
              show_comments: false,
              show_playcount: false,
              show_user: false
            });

            window[uniqId].bind(SC.Widget.Events.READY, function() {
              appBodyRef.videosReady.push(index);

              // appBodyRef.scplayer.set(widget);  //set reactive-var for use else where

              //conform state to Youtube codes (line 29)
              window[uniqId].bind(SC.Widget.Events.FINISH, function() {
                //TODO: start next song if there is one
                appBodyRef.state.set(0);
              });

              window[uniqId].bind(SC.Widget.Events.PLAY, function() {
                appBodyRef.nowPlaying.set(post);
                appBodyRef.state.set(1);
              });

              window[uniqId].bind(SC.Widget.Events.PAUSE, function() {
                appBodyRef.state.set(2);
              });

              //Soundcloud returns milliseconds, so convert to seconds to reuse formatting (bottom-player/helpers.js)
              window[uniqId].bind(SC.Widget.Events.PLAY_PROGRESS, function(progress) {
                appBodyRef.completed.set( progress.currentPosition / 1000 );
              });
            });
          }
        });
      }
    });
  });
});
