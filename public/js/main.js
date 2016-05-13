$(document).ready(function(){
    (function () {
      var lastListensBlock = $('.last-listens__inner');

      if(lastListensBlock.length !== 0){
          var lastListensWidth, lastListensItem;

          lastListensItem = $('.last-listens__item');
          lastListensWidth = lastListensItem.length * lastListensItem.outerWidth();
          lastListensBlock.css('width', lastListensWidth + "px");

          $('.last-listens__wrap').perfectScrollbar();
      }

      $('.more-users-dropdown__wrap').perfectScrollbar();

      if(window.matchMedia("(min-width: 768px)").matches){
          //Playlist height
          var headerHeight, sidebar, sidebarOffset, playlist;

          //Perfect scrollbar
          $('.sr-playlist').perfectScrollbar();


          //Profile page sidebar
          sidebar = $('.sidebar');

          if (sidebar.hasClass('sidebar--profile-page')) {
              sidebarOffset = sidebar.offset().top;

              $('.wrapper').on('scroll', function(){
                  scrollTop = $('.wrapper').scrollTop();

                  if (scrollTop > sidebarOffset) {
                      sidebar.removeClass('sidebar--profile-page');
                  } else {
                      sidebar.addClass('sidebar--profile-page');
                  }
              });
          }
      }
    }());
});
