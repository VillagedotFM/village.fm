import './bottom-player.html';
import './helpers.js';
import './events.js';


Template.bottom_player.onRendered(function bottomPlayerOnRendered() {
  Tracker.autorun(function(){
    setInterval(function(){ //Track video progress for scrubber, convert to seconds if SC
      let post = appBodyRef.nowPlaying.get();
      if (post) {
        if (post.type === 'youtube') {
          if (window['ytplayer'] && window['ytplayer'].l) {
            if (window['ytplayer'].getCurrentTime) {
              var completed = window['ytplayer'].getCurrentTime();
              appBodyRef.completed.set(completed);
            }
          }
        } else {
          if (typeof window['scplayer-'+post._id] !== 'undefined') {
            let completed = window['scplayer-'+post._id].currentTime();
            appBodyRef.completed.set(completed / 1000);
          }
        }
      }
    }, 500);
  });
});
