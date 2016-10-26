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
  $('.side-menu__villages').perfectScrollbar({'suppressScrollX': true });
  $('.side-menu__villages').scrollTop(0);

  $('.side-menu__villages').on('ps-scroll-down', function() {
    $('.side-menu header').addClass('scrolled');
  });

  $('.side-menu__villages').on('ps-y-reach-start', function() {
    $('.side-menu header').removeClass('scrolled');
  });
})
