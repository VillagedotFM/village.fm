Template.header_profile.events({
  "click .vf-header__log-out": function(event, template){
    Meteor.logout(function(err){
      if (err) {
          throw new Meteor.Error("Logout failed");
      } else {
        mixpanel.track('Logged out');
      }
    });
  },
  "click .vf-header__feedback-btn": function(event, template) {
     $('.feedback__contant').slideToggle();
  }
});
