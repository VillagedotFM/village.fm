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

      //TODO: refactor after soundcloud
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

            //TODO: move getCurrentTime to helper?
            setInterval(function(){ //Track video progress for scrubber
              var completed = yt.player.getCurrentTime();
              appBodyRef.completed.set(completed)
            }, 100);
          });
        }
      }
    }
  });
});
