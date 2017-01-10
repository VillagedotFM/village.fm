import { Villages } from '../../../api/villages/villages.js';

Template.header.helpers({
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
	},
  'currentVillage': () => {
    const villageSlug = FlowRouter.getParam('villageSlug');
    let village;

    if (villageSlug) {    //Handle main village (no slug)
      village = Villages.findOne({'friendlySlugs.slug.base': villageSlug});
    } else {
      village = Villages.findOne({'friendlySlugs.slug.base': "main"});
    }

    if (village) {
      return village;
    }
  },
  villageTopBar: function() {
		const villageSlug = FlowRouter.getParam('villageSlug');
		if (villageSlug) {
			return villageSlug;
		} else {
			return "main";
		}
	}
});
