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

    Meteor.call('tagUsers', post, taggedUsers, function(err, result){
      if(!err){
        mixpanel.track('Tagged a User', {
          postId: post._id,
          taggedUserCount: taggedUsers.length
        });

        const totalUsersTagged = mixpanel.get_property('totalUsersTagged');
        mixpanel.register({
            'totalUsersTagged': totalUsersTagged + taggedUsers.length
        });

        mixpanel.people.increment({
            'totalUsersTagged': taggedUsers.length
        });
      }
    });
    Tags.set('taggedUsers', []);
    $('.post__send[data-id="' + id +'"]').removeClass('active');
    $('.post__comments[data-id="' + id +'"]').addClass('active');
    send.hide();
    comment.show();



  },
  "click .post__rating": function(event, template){
    event.stopPropagation();
    if(Meteor.userId()) {
      let upvotedPost = this;
      Meteor.call('upvotePost', upvotedPost._id, function(err, affected) {
        if (err) {
          appBodyRef.upvotedError.set(true);
        } else {
          if(!(_.contains(upvotedPost.upvotedBy, Meteor.userId()))){
            appBodyRef.upvotedSuccess.set(upvotedPost);
            setTimeout(function(){
              appBodyRef.upvotedSuccess.set(null);
            }, 2000);
          }

          if(affected){
            let postedBy = Meteor.users.findOne(upvotedPost.createdBy);
            mixpanel.track('Upvoted a Post', {
              postId: upvotedPost._id,
              createdBy: postedBy.profile.name
            });

            const totalPostsUpvoted = mixpanel.get_property('totalPostsUpvoted');
            mixpanel.register({
                'totalPostsUpvoted': totalPostsUpvoted + 1
            });

            mixpanel.people.increment({
                'totalPostsUpvoted': 1
            });

            appBodyRef.upvotedSuccess.set(upvotedPost);
            setTimeout(function(){
              appBodyRef.upvotedSuccess.set(null);
            }, 2000);

          } else {
            const totalPostsUpvoted = mixpanel.get_property('totalPostsUpvoted');
            mixpanel.register({
                'totalPostsUpvoted': totalPostsUpvoted - 1
            });

            mixpanel.people.increment({
                'totalPostsUpvoted': -1
            });
          }
        }
      });
    } else {
      appBodyRef.guestAction.set('upvotePost');
    }
  },
  "click .posted-comment__upvote-cell": function(event, template){
    event.stopPropagation();
    if(Meteor.userId()) {
      let upvotedComment = this;
      Meteor.call('upvoteComment', upvotedComment._id, function(err, data) {
        console.log( err || "Upvoted comment");
      });
    } else {
      appBodyRef.guestAction.set('upvoteComment');
    }
  },
  "click .posted-comment-reply__upvote-cell": function(event, template){
    event.stopPropagation();
    if(Meteor.userId()) {
      let parentComment = $(event.currentTarget).data('parent');
      let index = $(event.currentTarget).data('value');
      Meteor.call('upvoteReply', parentComment, index, function(err, data) {
        console.log( err || "Upvoted reply");
      });
    } else {
      appBodyRef.guestAction.set('upvoteComment');
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

      mixpanel.track('Commened on a Post', {
        postId: postId,
        reply: false
      });

      mixpanel.people.set({
        dateOfLastComment: new Date().toISOString()
      });

      const comments = Comments.find({createdBy: Meteor.userId(), createdAt: { $gte: new Date(new Date().setDate(new Date().getDate()-1)) } }).fetch();
      if(comments.length === 1){
        mixpanel.people.increment({
          'daysWithAComment': 1
        });
      }
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

      mixpanel.track('Commened on a Post', {
        postId: postId,
        reply: true
      });

      mixpanel.people.set({
        dateOfLastComment: new Date().toISOString()
      });
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
  "click .share-dropdown__social": function(event, template){
    window.open($(event.currentTarget).data('href'), 'Title', 'width=800,height=500');

    mixpanel.track('Shared Song', {
      platform: $(event.currentTarget).text()
    });

    const totalPostsShared = mixpanel.get_property('totalPostsShared');
    mixpanel.register({
        'totalPostsShared': totalPostsShared + 1
    });

    mixpanel.people.increment({
        'totalPostsShared': 1
    });
  },
  "click .share-dropdown__copy": function(event, template){
    var $temp = $("<input>");
    $("body").append($temp);
    $temp.val(window.location.origin+'/post/'+this._id).select();
    document.execCommand("copy");
    $temp.remove();
    $('.share-dropdown__copy#share-'+this._id).addClass('share-dropdown__copy--active');

    mixpanel.track('Shared Song', {
      platform: 'Copy'
    });

    const totalPostsShared = mixpanel.get_property('totalPostsShared');
    mixpanel.register({
        'totalPostsShared': totalPostsShared + 1
    });

    mixpanel.people.increment({
        'totalPostsShared': 1
    });
  },
  "mouseenter .post": function(event, template) {
    $('.sr-playlist__item').removeClass('sr-playlist__item--active');
    $('#playlist-' + this._id).addClass('sr-playlist__item--active');
  }
});
