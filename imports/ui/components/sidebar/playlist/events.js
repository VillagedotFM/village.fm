Template.playlist.events({
  "click .upvote-block": function(event, template){
    if(Meteor.userId()) {
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
    let selectedPost = this;
    if (selectedPost.type === 'youtube') {
      yt.player.playVideo();
    } else {
      appBodyRef.scplayer.get().play();
    }
  },
  "click .sr-playlist__play--paused": function(event, template){
    //TODO: find which video to pause
    let selectedPost = this;
    if (selectedPost.type === 'youtube') {
      yt.player.pauseVideo();
    } else {
      appBodyRef.scplayer.get().pause();
    }
  }
});
