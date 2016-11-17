Template.header_village.helpers({
	isMobile: function() {
		return appBodyRef.mobile.get();
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
