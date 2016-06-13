function pauseEverythingElse(id) {
  let posts = appBodyRef.displayPosts.get();
  _.each(posts, function(post){ //TODO: add yt pauses
    if (post.type === 'soundcloud' && post._id !== id) {
      window['scplayer-' + post._id].pause();
    }
  });
}

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
  "click .sr-playlist__play": function(event, template){
    let selectedId = event.currentTarget.id;
    let selectedPost = Posts.findOne(selectedId);

    if (selectedPost.type === 'youtube') {
      //TODO: check if iframe is playing
      yt0.player.playVideo();
    } else {
      window['scplayer-' + selectedId].toggle();
    }
  }
});
