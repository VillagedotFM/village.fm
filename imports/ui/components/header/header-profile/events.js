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
        console.log("Logged Out!");
      }
    });
  }
});
