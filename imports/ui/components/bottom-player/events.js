Template.bottom_player.events({
  "click .upvote-block": function(event, template){
    //TODO: upvoting a post stops it...
    if(Meteor.userId()) {
      let upvotedPost = this;
      Meteor.call('upvotePost', upvotedPost._id, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(upvotedPost);
        }
      });
    } else {
      alert('Please login to upvote posts!');
    }
  },
});
