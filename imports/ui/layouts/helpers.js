Template.app_body.helpers({
  signUp: function(){
    return appBodyRef.signUp.get();
  },
  guestAction: function(){
    return appBodyRef.guestAction.get();
  },
  village() {
    if(FlowRouter.getParam('villageSlug')){
      return Villages.findOne();
    }
	},
  showTermsOrPolicy: function() {
    return appBodyRef.showTermsOrPolicy.get();
  },
  showSideMenu: function() {
    return appBodyRef.showSideMenu.get();
  }
});
