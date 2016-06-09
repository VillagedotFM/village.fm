Template.profile.helpers({
  user: function(){
    let id = FlowRouter.getParam('_id');  //Grab id from url and ensure it's a real user
    let user = _.findWhere(Meteor.users.find().fetch(), {_id: id});
    if (user) {
      return user;
    }
  }
});
