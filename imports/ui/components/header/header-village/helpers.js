Template.header_village.helpers({
	villageLogoUrl(slug) {
		// TODO: use template string
		if (slug) {
			return 'images/img-topbar-' + slug + '@3x.png';
		}
	}
});
