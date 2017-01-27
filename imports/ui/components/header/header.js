import './header.html';
import './events.js';
import './helpers.js';
import './notifications/notifications.js';
import './header-profile/header-profile.js';
import './header-village/header-village.js';
import './header-village/header-village.js';
import '../community-area/community-area-categories/community-area-categories.js';


Template.header.onRendered(function() {
  // Header scroll event handlers
  $(window).scroll(function() {
    let windowScrollPosition = $(window).scrollTop();
    // Show / hide fixed header when community area is scrolled
    if (windowScrollPosition > 0) {
        $('.vf-header').addClass('vf-header--scrolled');
    }
    else {
        $('.vf-header').removeClass('vf-header--scrolled');
    }

    // Show / hide village logo in header
    if(typeof $('.vf-community-area__details').offset() !== 'undefined' && windowScrollPosition > $('.vf-community-area__details').offset().top) {
      $('.vf-header__village').addClass('vf-header__village--show-village-logo');
    } else {
      $('.vf-header__village').removeClass('vf-header__village--show-village-logo');
    }
  });
});
