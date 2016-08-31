Template.header_village.helpers({
	village() {
		const villageSlug = FlowRouter.getParam('villageSlug');
		return Villages.findOne({slug: villageSlug});
	},
	villageLogoUrl(slug) {
		// TODO: use template string
		if (slug) {
			return 'images/img-topbar-' + slug + '@3x.png';
		}else {
			return 'images/img-topbar-main@3x.png';
		}
	}
});
