import './header.html';
import './events.js';
import './helpers.js';
import './notifications/notifications.js';
import './header-profile/header-profile.js';
import './header-village/header-village.js';


Template.header.onRendered(function() {
  // Show fixed header when community area is scrolled
  $(window).scroll(function() {
    if ($(window).scrollTop() > 0) {
        $('.vf-header').addClass('vf-header--scrolled');
    }
    else {
        $('.vf-header').removeClass('vf-header--scrolled');
    }
  });
});
