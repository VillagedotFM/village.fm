Template.header.helpers({
  notificationCount() {
    if(Notifications.find({'isRead': false, 'intendedFor': Meteor.userId()}).count() > 0)
      return Notifications.find({'isRead': false, 'intendedFor': Meteor.userId()}).count();
    return false;
  },
  isTuneIn() {
    if (FlowRouter.getParam('villageSlug') === 'tuneintelaviv') {
      return (appBodyRef.tuneInBanner.get()) ? true : false;
    } else {
      return false;
    }
  }
});
