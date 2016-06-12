import './playlist.html';
import './events.js';
import './helpers.js';


Template.playlist.onRendered(function playlistOnRendered(){
  this.autorun(function(){
    //On scroll of window
    $('.wrapper').on('scroll', function(){
      let scrollTop = $('.wrapper').scrollTop();

      //Find the post (in view) that matches in the playlist
      let index = parseInt(scrollTop / 850);  //850 is semi arbitrary

      //Remove arrow on everything else and add it to correct playlist item
      $('.sr-playlist__item').removeClass('sr-playlist__item--active');
      $('#playlist-' + index).addClass('sr-playlist__item--active');

      //Scroll playlist to the current post
      $('.sr-playlist').scrollTop(index * 50);

      //Find how many times the user has scrolled to the bottom
      let oldBottomHits = appBodyRef.bottomHits.get();
      let bottomHits = parseInt(scrollTop / 4000);  //4000 is bottom of page

      if (bottomHits > oldBottomHits) { //Only set new value if it's greater than the last
        appBodyRef.bottomHits.set(bottomHits);
      }
    });
  });
});
