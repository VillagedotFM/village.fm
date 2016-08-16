Template.header_village.helpers({
	village() {
		console.log(Villages.findOne({ slug: FlowRouter.current().params.villageSlug}));
		return Villages.findOne({ slug: FlowRouter.current().params.villageSlug});
	}
});
