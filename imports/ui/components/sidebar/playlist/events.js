//To eliminate some weirdness with SC.stream, make sure everything else is paused
pauseEverythingElse = function(id) {
  let posts = appBodyRef.postOrder.get();
  _.each(posts, function(post){ //TODO: add yt pauses
    if (post && post.type === 'soundcloud' && post._id !== id) {
      if (window['scplayer-' + post._id]) {
        window['scplayer-' + post._id].pause();
      }
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
      //TODO: yt: play yt video
    } else {
      if (window['scplayer-' + selectedId]._isPlaying) {
        window['scplayer-' + selectedId].pause();
      } else {
        window['scplayer-' + selectedId].play();
      }
    }
  },
  "click .sr-playlist__remove": function(event, template) {
    let postId = this._id;
    let inboxId = Inbox.findOne({postId:postId, to: Meteor.userId()})._id;
    Inbox.remove({_id:inboxId});

  }
});
