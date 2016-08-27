Template.header_village.helpers({
	village() {
		const villageSlug = FlowRouter.getParam('villageSlug');
		if (villageSlug !== '/')
			return Villages.findOne({slug: villageSlug});
	},
	villageLogoUrl(slug) {
		// TODO: use template string
		return 'images/img-topbar-' + slug + '@3x.png';
	}
});
