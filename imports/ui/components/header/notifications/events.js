Template.notifications.events({
  'click .header__notifications': function(event){
    event.stopPropagation();
    if ($('.ntf-dropdown').css('display') === 'none') {
      $('.ntf-dropdown').show();
      $('html, body').addClass('overflow-hidden');
      Meteor.call('allSeen');
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
  },
  'click .ntf-dropdown__item': function(event, template){
    Meteor.call('readNotification', this._id);
  }
});
