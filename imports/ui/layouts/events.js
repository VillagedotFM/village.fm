Template.app_body.events({
  "click .onboarding-popup__button": function(event, template){
    Meteor.loginWithFacebook({}, function(err){
      if (err) {
        throw new Meteor.Error("Facebook login failed");
      } else {
        console.log("Logged In!");
        appBodyRef.signUp.set(null);
        setTimeout(function () {
          $('.upload-section__upload').addClass('after-onboarding');
          $('.after-onboarding__overlay').show();
        }, 500);
      }
    });
  }
});
