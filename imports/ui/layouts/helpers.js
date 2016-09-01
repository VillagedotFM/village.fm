Template.app_body.helpers({
  signUp: function(){
    return appBodyRef.signUp.get();
  },
  guestAction: function(){
    return appBodyRef.guestAction.get();
  },
  village() {
		const villageSlug = FlowRouter.getParam('villageSlug');
		return Villages.findOne({slug: villageSlug});
	}
});
