import { YTPlayer } from 'meteor/hpx7:youtube-iframe-player';

import './feed.html';
import './helpers.js';
import './events.js';

//initialize youtube iframe with correct size
yt = new YTPlayer('ytplayer', {
  height: '270px',
  width: '479px'
});


Template.feed.onRendered(function feedOnRendered() {
  const feedRef = this;

  feedRef.autorun(function () {
    if (appBodyRef.postOrder.get().fetch().length > 0) {  //if playlist has posts
      let orderedPosts = appBodyRef.postOrder.get().fetch();
      // console.log(orderedPosts);

      //TODO: load up multiple instances
      if (orderedPosts[0].type === 'youtube') { //if first post is youtube video
        let yt_id = orderedPosts[0].vidId;
        if (yt.ready()) {
          appBodyRef.videoReady.set(true);
          yt.player.cueVideoById(yt_id);        //Cue up video in iframe

          yt.player.addEventListener('onStateChange', function (event) {
            if(event.data === 0){
              //TODO: start next song if there is one
              //ENDED
            } else if(event.data === 1){
              //PLAYING
              appBodyRef.nowPlaying.set(orderedPosts[0]);
            } else if(event.data === 2){
              //PAUSED
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
      } else if (orderedPosts[0].type === 'soundcloud') {
        // SC.stream('/tracks/' + orderedPosts[0].vidId).then(function(player){
        //   console.log(player);
        //   player.play();
        // });

        let widget = SC.Widget('scplayer');   //initialize sc widget with id of iframe

        //load new widget with no extra branding
        widget.load(orderedPosts[0].link, {
          buying: false,
          liking: false,
          download: false,
          sharing: false,
          show_comments: false,
          show_playcount: false,
          show_user: false
        });

        widget.bind(SC.Widget.Events.READY, function() {
          appBodyRef.videoReady.set(true);

          appBodyRef.scplayer.set(widget);  //set reactive-var for use else where

          //conform state to Youtube codes (line 29)
          widget.bind(SC.Widget.Events.FINISH, function() {
            //TODO: start next song if there is one
            appBodyRef.state.set(0);
          });

          widget.bind(SC.Widget.Events.PLAY, function() {
            appBodyRef.nowPlaying.set(orderedPosts[0]);
            appBodyRef.state.set(1);
          });

          widget.bind(SC.Widget.Events.PAUSE, function() {
            appBodyRef.state.set(2);
          });

          //Soundcloud returns milliseconds, so convert to seconds to reuse formatting (bottom-player/helpers.js)
          widget.bind(SC.Widget.Events.PLAY_PROGRESS, function(progress) {
            appBodyRef.completed.set( progress.currentPosition / 1000 );
          });
        });
      }
    }
  });
});
