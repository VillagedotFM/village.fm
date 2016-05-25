import './profile-tabs.html';

Template.profile_tabs.onRendered(function profileTabsOnRendered() {
  Session.set('profileTab', 'upvotes');
});

Template.profile_tabs.helpers({
  activeProfileTab(tab){
    return tab == Session.get('profileTab') ? 'active' : '';
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

Template.profile_tabs.events({
  "click .profileTab"(event, instance){
    Session.set('profileTab', $(event.target).data('tab'));
  }
});
