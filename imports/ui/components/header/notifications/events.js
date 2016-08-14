Template.notifications.events({
  'click .header__notifications': function(){
    if (appBodyRef.mobile.get()) {
      $('.ntf-dropdown').show();
      $('html, body').addClass('overflow-hidden');
    }
  },
  'click .ntf-dropdown__back': function(event, template){
    if (appBodyRef.mobile.get()) {
      event.stopPropagation();
      $('.ntf-dropdown').hide();
      $('html, body').removeClass('overflow-hidden');
    }
  },
  'click .ntf-dropdown__mark-all': function(event, template){
    Meteor.call('allRead');
  }
});
