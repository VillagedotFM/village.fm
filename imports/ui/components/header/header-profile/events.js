Template.header_profile.events({
  // "click .header-profile__thumb": function(event, template){
  //   event.stopPropagation();
  //   $('.sign-up').show();
  // },
  "click .logOutBtn": function(event, template){
    Meteor.logout(function(err){
      if (err) {
          throw new Meteor.Error("Logout failed");
      } else {
        mixpanel.track('Logged out');
      }
    });
  },
  "click .feedbackBtn": function(event, template) {
     $('.feedback__contant').slideToggle();
  }
});
