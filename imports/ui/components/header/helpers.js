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
  },
  isMobile: function() {
		return appBodyRef.mobile.get();
	},
  noImage: function() {
		const villageSlug = FlowRouter.getParam('villageSlug');
		const village = Villages.findOne({'friendlySlugs.slug.base': villageSlug});

    if (village) {
      if (village.image) {
        return false;
      } else {
        return village.name;
      }
    }
	}
});
