Template.side_menu_profile.events({
  "click .side-menu__logout": function(event, template){
    Meteor.logout(function(err){
      if (err) {
          throw new Meteor.Error("Logout failed");
      } else {
        mixpanel.track('Logged out');
      }
    });
  },
})
