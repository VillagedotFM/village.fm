Template.header_village.helpers({
	village() {
		return Villages.findOne();
	},
	isMainVillage(){
		const village = Villages.findOne({});
		return village && village.name == 'Main';
	}
});
