import { Profiles } from '/imports/api/profiles/profiles.js';

Template.app_body.events({
  "click .post-navigation": function(event, template){
    var postId = template.$(event.currentTarget).data('post-id');
    var villageSlug = template.$(event.currentTarget).data('village-slug').trim();
    if(villageSlug){
      FlowRouter.go('/' + villageSlug + '/post/' + postId);
    } else {
      // Scroll to Place of post minus 60px for the topbar
      $('html, body').animate({scrollTop: template.$('.post#' + postId).offset().top - 60}, 750, 'swing');
    }
  },
  "click": function(event, template){
     $('.send-to-friend__list, .sign-up, .invite-dropdown, .ntf-dropdown').hide();
  }
});
