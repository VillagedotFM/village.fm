Template.notifications.events({
  'click .vf-header__notifications__btn': function(event){
    notificationsRef.showBadge.set(false);
    notificationsRef.showDropdown.set(!notificationsRef.showDropdown.get());
    Meteor.call('allSeen');
    mixpanel.track('Viewed Notifications');
  },
  'click .vf-header__notifications__top__close': function(event, template){
    notificationsRef.showDropdown.set(false);
  },
  'click .vf-header__notifications__top__mark-all': function(event, template){
    Meteor.call('allRead');
  },
  'click .vf-header__notification': function(event, template){
    Meteor.call('readNotification', this._id);
  }
});
