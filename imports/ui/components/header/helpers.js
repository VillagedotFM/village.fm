Template.header.helpers({
  notificationCount() {
    if(Notifications.find({'isRead': false, 'intendedFor': Meteor.userId()}).count() > 0)
      return Notifications.find({'isRead': false, 'intendedFor': Meteor.userId()}).count();
    return false;
  },
  showNotificationBadge() {
    return Notifications.find({'isSeen': false, 'intendedFor': Meteor.userId()}).count() > 0;
  },
  isTuneIn() {
    if (FlowRouter.getParam('villageSlug') === 'tuneintelaviv') {
      return (appBodyRef.tuneInBanner.get()) ? true : false;
    } else {
      return false;
    }
  },
  'showSideMenu': () => {
    return appBodyRef.showSideMenu.get();
  }
});
