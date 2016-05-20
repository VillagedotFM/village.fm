import './bottom-player.html';


Template.bottom_player.helpers({
  isUpvoted: function() {
    if(_.contains(this.upvotedBy, Meteor.userId()))
      return 'upvote-block--active';
    else
      return '';
  },
  nowPlaying: function() {
    let nowPlayingPost = appBodyRef.nowPlaying.get();
    return Posts.findOne({_id:nowPlayingPost._id});
  }
});

Template.bottom_player.events({
  "click .upvote-block": function(event, template){
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
