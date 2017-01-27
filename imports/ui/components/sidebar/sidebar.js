import './sidebar.html';
import './helpers.js';
import './controls/controls.js';
import './tabs/tabs.js';
// import './inbox/inbox.js';
import './playlist/playlist.js';


Template.sidebar.onRendered(function() {
  // Stick sidebar (playlist) to the top on scroll
  $(window).scroll(function() {
    if ($(window).scrollTop() > $('.main').offset().top - 60) {
      $('.sidebar').addClass('sidebar--fixed');
    }
    else {
      $('.sidebar').removeClass('sidebar--fixed');
    }
  });
});
