Template.header_profile.helpers({
  postCount: function() {
    return Posts.find({"createdBy": Meteor.userId()}).count();
  }
});
