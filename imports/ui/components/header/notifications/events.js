Template.notifications.events({
  'mouseenter .header__notifications': function(event) {
    if(!appBodyRef.mobile.get()){
      event.stopPropagation();
      mixpanel.track('Viewed Notifications');
    }
  },
  'click .header__notifications': function(event){
    event.stopPropagation();
    if ($('.ntf-dropdown').css('display') === 'none') {
      $('.ntf-dropdown').show();
      $('html, body').addClass('overflow-hidden');
      mixpanel.track('Viewed Notifications');
    } else {
      $('.ntf-dropdown').hide();
    }
  },
  'click .ntf-dropdown__back': function(event, template){
    event.stopPropagation();
    $('.ntf-dropdown').hide();
    $('html, body').removeClass('overflow-hidden');
  },
  'click .ntf-dropdown__mark-all': function(event, template){
    Meteor.call('allRead');
  }
});
