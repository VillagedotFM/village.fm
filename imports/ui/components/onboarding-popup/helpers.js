Template.onboarding_popup.helpers({
  signUp: () => {
    return appBodyRef.signUp.get();
  },
  guestAction: () => {
    return appBodyRef.guestAction.get();
  },
  village: () => {
    if(FlowRouter.getParam('villageSlug')){
      return Villages.findOne();
    }
  },
  showTermsOrPolicy: () => {
    return appBodyRef.showTermsOrPolicy.get();
  },
})
