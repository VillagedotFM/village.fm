Template.header.helpers({
  notificationCount() {
    if(Notifications.find({'isRead': false, 'intendedFor': Meteor.userId()}).count() > 0)
      return Notifications.find({'isRead': false, 'intendedFor': Meteor.userId()}).count();
    return false;
  }
});
