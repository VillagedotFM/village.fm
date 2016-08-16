Template.header_village.helpers({
	village() {
		return Villages.findOne();
	},
	isMainVillage(){
		return Villages.findOne().name == 'Main';
	}
});
