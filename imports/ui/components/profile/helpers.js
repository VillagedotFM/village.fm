Template.profile.helpers({
  user: function(){
    let id = FlowRouter.getParam('_id');  //Grab id from url and ensure it's a real user
    let user = _.findWhere(Meteor.users.find().fetch(), {_id: id});
    if (user) {
      return user;
    }
  },
  lastUpvotes() {
    let id = FlowRouter.getParam('_id');  //Grab id from url and ensure it's a real user
    let user = _.findWhere(Meteor.users.find().fetch(), {_id: id});
    if (user) {
      return Posts.find({upvotedBy: user._id}, {sort: {lastUpvote:-1}}).fetch();
    }
  }
});
