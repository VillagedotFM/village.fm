import { Villages } from '../../../../api/villages/villages.js';

Template.header_village.helpers({
	isMobile: function() {
		return appBodyRef.mobile.get();
	},
	villageTopBar: function() {
		const villageSlug = FlowRouter.getParam('villageSlug');
		const village = Villages.findOne({'friendlySlugs.slug.base': villageSlug});

		if (villageSlug) {

			if (village) {
				if (village.image) {
					return villageSlug;
				} else {
					return false;
				}
			}

		} else {
			return "main";
		}
	}
});
