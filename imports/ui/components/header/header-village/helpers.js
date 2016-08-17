Template.header_village.helpers({
	village() {
		const villageSlug = FlowRouter.getParam('villageSlug');
       	return Villages.findOne({slug: villageSlug});
	}
});
