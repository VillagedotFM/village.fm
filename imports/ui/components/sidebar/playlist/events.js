//To eliminate some weirdness with SC.stream, make sure everything else is paused
pauseEverythingElse = function(id) {
  let posts = appBodyRef.postOrder.get();
  _.each(posts, function(post){
    if (post && post._id !== id) {
      if (window['scplayer-' + post._id]) {
        window['scplayer-' + post._id].pause();
      } else if (window['ytplayer-' + post._id]) {
        window['ytplayer-' + post._id].pauseVideo();
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
  "click .sr-playlist__play--play": function(event, template){
    let selectedId = event.currentTarget.id;
    let selectedPost = Posts.findOne(selectedId);

    if (selectedPost.type === 'youtube') {
      window['ytplayer-' + selectedId].playVideo();
    } else {
      window['scplayer-' + selectedId].play();
    }
  },
  "click .sr-playlist__play--paused": function(event, template){
    let selectedId = event.currentTarget.id;
    let selectedPost = Posts.findOne(selectedId);

    if (selectedPost.type === 'youtube') {
      window['ytplayer-' + selectedId].pauseVideo();
    } else {
      window['scplayer-' + selectedId].pause();
    }
  },
  "click .sr-playlist__remove": function(event, template) {
    let postId = this._id;
    let inboxId = Inbox.findOne({postId:postId, to: Meteor.userId()})._id;
    Inbox.remove({_id:inboxId});

  }
});
