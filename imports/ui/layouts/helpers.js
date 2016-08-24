Template.app_body.helpers({
  signUp: function(){
    return appBodyRef.signUp.get();
  },
  guestAction: function(){
    return appBodyRef.guestAction.get();
  }
});
