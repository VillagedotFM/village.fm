
import './header.html';
import './notifications/notifications.js';
import './header-profile/header-profile.js';



Template.header.helpers({
});

Template.header.events({
  "click .signUpBtn": function(event, template){
    Meteor.loginWithFacebook({}, function(err){
      if (err) {
        throw new Meteor.Error("Facebook login failed");
      } else {
        console.log("Logged In!");
        // $('.sign-up').hide();
      }
    });
  }
});
