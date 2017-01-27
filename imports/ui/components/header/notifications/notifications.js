import './notifications.html'
import './helpers.js'
import './events.js'

Template.notifications.onCreated(function() {
  notificationsRef = this;

  notificationsRef.showBadge = new ReactiveVar(true);
  notificationsRef.showDropdown = new ReactiveVar(false);
});

Template.notifications.onRendered(function notificationsOnRendered(){
  $('.vf-header__notifications__list').perfectScrollbar({'suppressScrollX': true });
  $('.vf-header__notifications__list').scrollTop(0);

  $('.vf-header__notifications__list')
    .on('ps-scroll-down', function() {
      $('.vf-header__notifications__dropdown').addClass('vf-header__notifications__dropdown--scrolled');
    })
    .on('ps-y-reach-start', function() {
      $('.vf-header__notifications__dropdown').removeClass('vf-header__notifications__dropdown--scrolled');
    });
});
