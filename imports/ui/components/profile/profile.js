import './profile.html';
import './helpers.js';
import './events.js';
import './profile-tabs/profile-tabs.js';

Template.profile.onRendered(function() {
  //TODO: reactive-var instead of hide
  $('.uploaded-item').hide();
  $('.sr-playlist__item--inbox').hide();
  $('.sr-inbox__arrow').removeClass('fa-caret-up');
});
