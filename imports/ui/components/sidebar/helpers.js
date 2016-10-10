Template.sidebar.helpers({
  upvotedSuccess: function(){
    return appBodyRef.upvotedSuccess.get();
  },
  upvotedError: function(){
    return appBodyRef.upvotedError.get();
  },
  isTuneIn() {
    return FlowRouter.getParam('villageSlug') === 'tuneintelaviv';
  }
});
