import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './sign-up.html';


Template.sign_up.helpers({
});

Template.sign_up.events({
  "click .sign-up": function(event, template){
     event.stopPropagation();
  },
  "click .sign-up__button": function(event, template){
    // Meteor.loginWithFacebook({}, function(err){
    //     if (err) {
    //       throw new Meteor.Error("Facebook login failed");
    //     } else {
    //       console.log("Logged In!");
    //       $('.sign-up').hide();
    //     }
    // });
  }
});
