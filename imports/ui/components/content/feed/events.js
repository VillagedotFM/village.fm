Template.feed.events({
  "click .post__comments": function(event, template){
    let id = this._id;
    let comment = $('.comments-block[data-id="' + id +'"]');
    let send = $('.send-to-friend[data-id="' + id +'"]');

    $('.post__send[data-id="' + id +'"]').removeClass('active');
    $('.post__comments[data-id="' + id +'"]').addClass('active');
    send.hide();
    comment.show();
  },
  "click .post__send": function(event, template){
    let id = this._id;
    let comment = $('.comments-block[data-id="' + id +'"]');
    let send = $('.send-to-friend[data-id="' + id +'"]');

    $('.post__comments[data-id="' + id +'"]').removeClass('active');
    $('.post__send[data-id="' + id +'"]').addClass('active');
    comment.hide();
    send.show();
  },
  "click .send-to-friend__send-btn": function(event, template){
    let id = this._id;
    let comment = $('.comments-block[data-id="' + id +'"]');
    let send = $('.send-to-friend[data-id="' + id +'"]');

    let post = Posts.findOne(id);
    let taggedUsers = [];
    _.each(Tags.get('taggedUsers'), function(user) {
      taggedUsers.push(user._id);
      console.log(user._id);
    });
    if (!taggedUsers)
      return;

    Meteor.call('tagUsers', post, taggedUsers);
    Tags.set('taggedUsers', []);
    $('.post__send[data-id="' + id +'"]').removeClass('active');
    $('.post__comments[data-id="' + id +'"]').addClass('active');
    send.hide();
    comment.show();

  },
  "click .post__rating": function(event, template){
    if(Meteor.userId()) {
      let upvotedPost = this;
      Meteor.call('upvotePost', upvotedPost._id, function(err, data) {
        console.log( err || "Upvoted!" + upvotedPost._id);
      });
    } else {
      alert('Please login to upvote posts!');
    }
  },
  "click .posted-comment__upvote-cell": function(event, template){
    if(Meteor.userId()) {
      let upvotedComment = this;
      Meteor.call('upvoteComment', upvotedComment._id, function(err, data) {
        console.log( err || "Upvoted comment");
      });
    } else {
      alert('Please login to upvote comments!');
    }
  },
  "click .posted-comment-reply__upvote-cell": function(event, template){
    if(Meteor.userId()) {
      let parentComment = $(event.currentTarget).data('parent');
      let index = $(event.currentTarget).data('value');
      Meteor.call('upvoteReply', parentComment, index, function(err, data) {
        console.log( err || "Upvoted reply");
      });
    } else {
      alert('Please login to upvote comments!');
    }
  },
  "click .user-comment__submit-cell": function(event, template){
    let postId = this._id;
    let name = 'post-comment-' + postId;
    let content = $('input[name='+name+']').val();

    if (content) {
      Comments.insert({
        postId: postId,
        content: content
      });
    }

    $('input[name='+name+']').val('');
  },
  "click .user-reply__submit-cell": function(event, template){
    let commentId = this._id;
    let content = $('input[name=post-comment]').val();

    if (content) {
      Comments.update({_id:commentId}, {$push:{
        replies: {
          content: content,
          likes: [Meteor.userId()],
          createdAt: new Date(),
          createdBy: Meteor.userId()
        }
      }});
    }

    $('input[name=post-comment]').val('');
    appBodyRef.replyTo.set(null);
  },
  "click .posted-comment__reply": function(event, template){
    let commentId = this._id;

    $('input[name=post-comment]').val('');
    appBodyRef.replyTo.set(commentId);
  },
  "click .post__video-play": function(event, template){
    let selectedId = event.currentTarget.id;
    let selectedPost = Posts.findOne(selectedId);

    if (selectedPost.type === 'youtube') {
      window['ytplayer-' + selectedId].playVideo();
    } else {
      window['scplayer-' + selectedId].play();
    }

    mixpanel.track('Clicked play button', {
      area: 'Feed'
    });
  },
  "click .post__video-pause": function(event, template){
    let selectedId = event.currentTarget.id;
    let selectedPost = Posts.findOne(selectedId);
    window['state-'+selectedPost._id] = 2;
    if (selectedPost.type === 'youtube') {
      window['ytplayer-' + selectedId].pauseVideo();
    } else {
      window['scplayer-' + selectedId].pause();
    }
  },
  "click .share-dropdown__copy": function(event, template){
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(window.location.origin+'/post/'+this._id).select();
    document.execCommand("copy");
    $temp.remove();
    $('.share-dropdown__copy#share-'+this._id).addClass('share-dropdown__copy--active');
  },
  "mouseenter .post": function(event, template) {
    $('.sr-playlist__item').removeClass('sr-playlist__item--active');
    $('#playlist-' + this._id).addClass('sr-playlist__item--active');
  }
});
