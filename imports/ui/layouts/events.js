import { Profiles } from '/imports/api/profiles/profiles.js';

Template.app_body.events({
  "click": function(event, template){
     $('.send-to-friend__list, .sign-up, .invite-dropdown, .ntf-dropdown').hide();
     hideMenu();
  },
  "click .onboarding-popup__button": function(event, template){
    Meteor.loginWithFacebook({requestPermissions: ['email', 'public_profile']}, function(err){
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

        const profile = Profiles.findOne({createdBy: user._id });

        if(profile){
          mixpanel.people.set({
            '$email': Meteor.user().services.facebook.email,
            '$first_name': profile.firstName,
            '$last_name': profile.lastName,
            '$name': profile.firstName + " " + profile.lastName,
            'gender': profile.gender,
            'minAge': profile.ageRange.min,
            'maxAge': profile.ageRange.max
          });
        }



        console.log("Logged In!");
        appBodyRef.signUp.set(null);
        appBodyRef.guestAction.set(null);

        $('.wrapper').scrollTop(0);

        setTimeout(function () {
          $('.upload-section__upload').addClass('after-onboarding');
          $('.after-onboarding__overlay').show();
        }, 500);
      }
    });
  },
  'click .onboarding-popup__terms-link': () => {
    appBodyRef.showTermsOrPolicy.set('terms');
  },
  'click .onboarding-popup__policy-link': () => {
    appBodyRef.showTermsOrPolicy.set('policy');
  },
  'click .onboarding-popup__overlay': () => {
    appBodyRef.signUp.set(null);
    appBodyRef.guestAction.set(null);
    appBodyRef.showTermsOrPolicy.set(null);
  }
});
