Template.playlist.events({
  "click .upvote-block": function(event, template){
    if(Meteor.userId()) {
      let upvotedPost = this;
      Meteor.call('upvotePost', upvotedPost._id, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log("Upvoted!" + upvotedPost._id);
        }
      });
    } else {
      alert('Please login to upvote posts!');
    }
  },
  "click .sr-playlist__play--play": function(event, template){
    //TODO: find which video to play
    // yt.player.playVideo();
    console.log(appBodyRef.scplayer.get());
  },
  "click .sr-playlist__play--paused": function(event, template){
    //TODO: find which video to pause
    yt.player.pauseVideo();
  }
});
