import { Profiles } from '/imports/api/profiles/profiles.js';

Template.app_body.events({
  "click .post-navigation": function(event, template){
    var postId = $(event.currentTarget).attr('data-post-id');
    $('html, body').animate({scrollTop: template.$('.post#' + postId).offset().top - 60}, 750, 'swing');
  },
  "click": function(event, template){
     $('.send-to-friend__list, .sign-up, .invite-dropdown, .ntf-dropdown').hide();
  }
});
