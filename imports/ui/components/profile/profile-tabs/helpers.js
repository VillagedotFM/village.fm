Template.profile_tabs.helpers({
  activeProfileTab(tab){
    return tab == appBodyRef.profileTab.get() ? 'active' : '';
  },
  mutualCount: function() {
    return Posts.find({"upvotedBy": {$all: [FlowRouter.getParam('_id'), Meteor.userId()]}}).count();
  },
  upvoteCount: function() {
    return Posts.find({"upvotedBy": FlowRouter.getParam('_id')}).count();
  },
  postCount: function() {
    return Posts.find({"createdBy": FlowRouter.getParam('_id')}).count();
  }
});
