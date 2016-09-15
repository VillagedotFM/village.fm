Template.app_body.events({
  "click": function(event, template){
     $('.send-to-friend__list, .sign-up, .invite-dropdown').hide();
     hideMenu();
  },
  "click .onboarding-popup__button": function(event, template){
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
          'gender': Meteor.user().services.facebook.gender,
          'anonymous': false

        });

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
  }
});
