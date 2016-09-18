Template.app_body.helpers({
  signUp: function(){
    return appBodyRef.signUp.get();
  },
  guestAction: function(){
    return appBodyRef.guestAction.get();
  },
  village() {
		return Villages.findOne();
	},
  showTermsOrPolicy: function() {
    return appBodyRef.showTermsOrPolicy.get();
  }
});
