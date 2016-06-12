import { YTPlayer } from 'meteor/hpx7:youtube-iframe-player';

import './feed.html';
import './helpers.js';
import './events.js';

yt = new YTPlayer('ytplayer', {
  height: '270px',
  width: '479px'
});


Template.feed.onRendered(function feedOnRendered() {
  const feedRef = this;

  feedRef.autorun(function () {
    if (appBodyRef.postOrder.get().length > 0) {
      let orderedPosts = appBodyRef.postOrder.get();
      console.log(orderedPosts);

      if (orderedPosts[0].type === 'youtube') { //if first post is youtube video
        let yt_id = orderedPosts[0].vidId;
        if (yt.ready()) {
          appBodyRef.videoReady.set(true);
          yt.player.cueVideoById(yt_id);

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
            appBodyRef.state.set(state);

            setInterval(function(){ //Track video progress for scrubber
              var completed = yt.player.getCurrentTime();
              appBodyRef.completed.set(completed)
            }, 100);
          });
        }
      } else if (orderedPosts[0].type === 'soundcloud') {
        console.log('SC');
        // SC.stream('/tracks/' + orderedPosts[0].vidId).then(function(player){
        //   console.log(player);
        //   player.play();
        // });

        // SC.oEmbed(orderedPosts[0].link, {
        //   element: document.getElementById('scplayer'),
        //   maxheight: 270,
        //   show_comments: false
        // }).then(function(embed){
        //   let element = $('#scplayer iframe');
        //   let widget = SC.Widget(element);
        //   widget.bind(SC.Widget.Events.READY, function() {
        //     widget.bind(SC.Widget.Events.PLAY, function() {
        //       // get information about currently playing sound
        //       widget.getCurrentSound(function(currentSound) {
        //         console.log('sound ' + currentSound.get('') + 'began to play');
        //       });
        //     });
        //     // get current level of volume
        //     widget.getVolume(function(volume) {
        //       console.log('current volume value is ' + volume);
        //     });
        //     // set new volume level
        //     widget.setVolume(50);
        //     // get the value of the current position
        //   });
        // });

        let widget = SC.Widget('scplayer');

        // load new widget
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
