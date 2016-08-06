Template.header.events({
  //TODO: instead of hide, use reactive-var
  "click .signUpBtn": function(event, template){
    Meteor.loginWithFacebook({}, function(err){
      if (err) {
        throw new Meteor.Error("Facebook login failed");
      } else {
        console.log("Logged In!");
        // $('.sign-up').hide();
      }
    });
  },
  "click .header__logo, click header__logo-mobile"(event, instance) {
    $('.uploaded-item').hide();
    $('.sr-playlist__item--inbox').hide();
    $('.sr-inbox__arrow').removeClass('fa-caret-up');
  },
  'click .header__hum': function(event, template){
    $('.header__hum').toggleClass('header__hum--active');
    $('.main, .header, .bottom-player, .us-mobile').toggleClass('menu-open');
  },
});
