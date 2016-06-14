Template.feed.events({
  "click .post__comments": function(event, template){
    //TODO: refactor with reactive-var
    let id = $('.post__comments').data('id');
    let comment = $('.comments-block[data-id="' + id +'"]');
    let send = $('.send-to-friend[data-id="' + id +'"]');

    $('.post__send').removeClass('active');
    $('.post__comments').addClass('active');
    send.hide();
    comment.show();
  },
  "click .post__send": function(event, template){
    //TODO: refactor with reactive-var
    let id = $('.post__send').data('id');
    let comment = $('.comments-block[data-id="' + id +'"]');
    let send = $('.send-to-friend[data-id="' + id +'"]');

    $('.post__comments').removeClass('active');
    $('.post__send').addClass('active');
    comment.hide();
    send.show();
  },
  "click .upvote-block, click .post__rating": function(event, template){
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
  "click .post__video-play": function(event, template){
    let selectedId = event.currentTarget.id;
    let selectedPost = Posts.findOne(selectedId);

    if (selectedPost.type === 'youtube') {
      yt0.player.playVideo();
    } else {
      window['scplayer-' + selectedId].play();
    }
  },
  "click .post__video-pause": function(event, template){
    let selectedId = event.currentTarget.id;
    let selectedPost = Posts.findOne(selectedId);

    if (selectedPost.type === 'youtube') {
      yt0.player.pauseVideo();
    } else {
      window['scplayer-' + selectedId].pause();
    }
  }
});
