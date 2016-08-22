Template.header.events({
  //TODO: instead of hide, use reactive-var
  "click .signUpBtn": function(event, template){
    Meteor.loginWithFacebook({}, function(err){
      if (err) {
        throw new Meteor.Error("Facebook login failed");
      } else {

        var user = Meteor.user();
        // FIX: Find another way how to know that a new user is logging in
        if(user.profile.newUser){
          mixpanel.alias(Meteor.userId());
          mixpanel.track('Signed Up', {
            service: 'facebook'
            // TODO: FB friends properties
          });
          Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.newUser": false}});
        } else {
          mixpanel.identify(Meteor.userId());
          mixpanel.track('Signed In', {
            service: 'facebook'
            // TODO: FB friends properties
          });
        }
       
        mixpanel.people.set({
          '$email': Meteor.user().services.facebook.email,
          '$first_name': Meteor.user().services.facebook.first_name,
          '$last_name': Meteor.user().services.facebook.last_name,
          '$name': Meteor.user().services.facebook.name,
          'gender': Meteor.user().services.facebook.gender
        });
        
        // $('.sign-up').hide();
      }
    });
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
});
