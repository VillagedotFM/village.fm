Template.inbox.helpers({
  count: function() {
    if (Inbox.find({to: Meteor.userId()}).fetch().length === 0) {
      return null;
    } else {
      return Inbox.find({to: Meteor.userId()}).fetch().length;
    }
  }
});
