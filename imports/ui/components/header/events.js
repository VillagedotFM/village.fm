Template.header.events({
  //TODO: instead of hide, use reactive-var
  "click .header__unloged": function(event, template){
    event.stopPropagation();
    appBodyRef.signUp.set(true);
  },
  "click .header__logo, click header__logo-mobile"(event, instance) {
    $('.uploaded-item').hide();
    $('.sr-playlist__item--inbox').hide();
    $('.sr-inbox__arrow').removeClass('fa-caret-up');
  },
  'click .header__hum': function(event, template){
    event.stopPropagation();
    $('.header__hum').toggleClass('header__hum--active');
    $('.main, .header, .bottom-player, .us-mobile').toggleClass('menu-open');
  },
});
