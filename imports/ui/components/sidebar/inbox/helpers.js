Template.inbox.helpers({
  count: function() {
    if (Inbox.find({to: Meteor.userId()}).fetch().length === 0) {
      return null;
    } else {
      var inboxCount = 0;
      _.each(Inbox.find({to: Meteor.userId()}).fetch(), function(inboxItem) {
        const post = Posts.findOne(inboxItem.postId);
        if(FlowRouter.getParam('villageSlug')){
          const village = Villages.findOne({_id: post.villages[0]});
          if(village.slug == FlowRouter.getParam('villageSlug')){
            inboxCount++;
          }
        } else {
          inboxCount++;
        }
      });

      return inboxCount;
    }
  },
  arrowUp() {
    return appBodyRef.inboxOpen.get() ? 'fa-caret-up' : '';
  }
});
