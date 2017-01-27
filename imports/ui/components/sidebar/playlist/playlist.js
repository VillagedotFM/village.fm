import './playlist.html';
import './events.js';
import './helpers.js';
import './rendered.js';

let postToVote = new ReactiveVar();

export {postToVote};


Template.playlist.onRendered(function playlistOnRendered(){
  this.autorun(function(){
    //On scroll of window
    $(window).scroll(function() {
      if($(window).innerHeight() + $(window).scrollTop() >= $('.wrapper').innerHeight()) {
        let oldBottomHits = appBodyRef.bottomHits.get();
        appBodyRef.bottomHits.set(oldBottomHits+1);
      }
    });
  });

  this.autorun(function(){
    let data = appBodyRef.postSuccess.get();
    let order = appBodyRef.postOrder.get();
    if (data) {
      setTimeout(function () {
        $(".sr-playlist").scrollTop( $( ".sr-playlist" ).prop( "scrollHeight" ) );
        $('.sr-playlist__item').removeClass('sr-playlist__item--active');
        $('#playlist-' + data).addClass('sr-playlist__item--active');
        $('#playlist-'+data).addClass('popup');
        $('.sidebar').addClass('zindex');
        var left, top;

        left = $('#playlist-'+data).offset().left + 'px';
        textLeft = ($('#playlist-'+data).offset().left + 10) + 'px';
        top = $('#playlist-'+data).offset().top + 'px';

        $('.after-post--bg').show().css({left: left,top: top});
        $('.after-post--text').show().css({left: textLeft,top: top});
        $('.after-post--overlay').show();
      }, 500);
    }
  });
});
