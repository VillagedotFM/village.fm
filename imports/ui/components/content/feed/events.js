Template.feed.events({
  "click .post__comments": function(event, template){
    let id = $('.post__comments').data('id');
    let comment = $('.comments-block[data-id="' + id +'"]');
    let send = $('.send-to-friend[data-id="' + id +'"]');

    $('.post__send[data-id="' + id +'"]').removeClass('active');
    $('.post__comments[data-id="' + id +'"]').addClass('active');
    send.hide();
    comment.show();
  },
  "click .post__send": function(event, template){
    let id = $('.post__send').data('id');
    let comment = $('.comments-block[data-id="' + id +'"]');
    let send = $('.send-to-friend[data-id="' + id +'"]');

    $('.post__comments[data-id="' + id +'"]').removeClass('active');
    $('.post__send[data-id="' + id +'"]').addClass('active');
    comment.hide();
    send.show();
  },
  "click .send-to-friend__send-btn": function(event, template){
    let id = $('.post__send').data('id');
    let post = Posts.findOne(id);
    let taggedUsers = [];
    _.each(Tags.get('taggedUsers'), function(user) {
      taggedUsers.push(user._id);
    });
    if (!taggedUsers)
      return;

    Meteor.call('tagUsers', post, taggedUsers, function(error, data) {
      console.log(data);
    });
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
