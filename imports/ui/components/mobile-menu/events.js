Template.mobile_menu.events({
  "click .mobile-menu__item--log-out": function(event, template){
    Meteor.logout(function(err){
      if (err) {
          throw new Meteor.Error("Logout failed");
      } else {
        console.log("Logged Out!");
      }
    });
  },
  "click #mobileSignIn": function(event, template){
    Meteor.loginWithFacebook({}, function(err){
      if (err) {
        throw new Meteor.Error("Facebook login failed");
      } else {
        console.log("Logged In!");
        // $('.sign-up').hide();
      }
    });
  },
});
