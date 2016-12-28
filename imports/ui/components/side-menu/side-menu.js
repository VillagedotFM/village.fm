import './side-menu.html';
import './events.js';
import './helpers.js';

import './side-menu-profile/side-menu-profile.js';

Template.side_menu.onCreated(() => {
  Meteor.subscribe("villages.sideMenu");

  sideMenuRef = this;
  sideMenuRef.visitedVillages = new ReactiveVar({});
});


Template.side_menu.onRendered(() => {
  $('.vf-side-menu__villages').perfectScrollbar({'suppressScrollX': true });
  $('.vf-side-menu__villages').scrollTop(0);

  $('.vf-side-menu__villages').on('ps-scroll-down', function() {
    $('.vf-side-menu header').addClass('scrolled');
  });

  $('.vf-side-menu__villages').on('ps-y-reach-start', function() {
    $('.vf-side-menu header').removeClass('scrolled');
  });
})
