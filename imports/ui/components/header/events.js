import { Email } from 'meteor/email';

Template.header.events({
  "click .header__unloged": function(event, template){
    event.stopPropagation();
    appBodyRef.signUp.set(true);
    
    mixpanel.track('Clicked Sign In Button');
  },
  "click .header__logo, click header__logo-mobile"(event, instance) {
    $('.uploaded-item').hide();
    $('.sr-playlist__item--inbox').hide();
    $('.sr-inbox__arrow').removeClass('fa-caret-up');
  },
  'click .header__hum': function(event, template){
    event.stopPropagation();
    $('.header__hum').toggleClass('header__hum--active');
    $('.main, .header, .bottom-player, .us-mobile').toggleClass('menu-open');
  },
  'submit form': function(event, template) {
    event.preventDefault();

    var user = Meteor.user();
    var feedbackText = template.find('#feedback-text');

    Meteor.call('submitFeedbackForm', user.services.facebook.email, user.profile.name, feedbackText.value);

    feedbackText.value = "";
    $('.feedback__contant').slideToggle();
  }
});
