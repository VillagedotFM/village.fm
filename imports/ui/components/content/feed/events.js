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

        window.analytics.totalUsersTagged = window.analytics.totalUsersTagged + taggedUsers.length;
        mixpanel.register({
            'totalUsersTagged': window.analytics.totalUsersTagged
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


            window.analytics.totalPostsUpvoted = window.analytics.totalPostsUpvoted + 1;
            mixpanel.register({
                'totalPostsUpvoted': window.analytics.totalPostsUpvoted
            });

            mixpanel.people.increment({
                'totalPostsUpvoted': 1
            });

            appBodyRef.upvotedSuccess.set(upvotedPost);
            setTimeout(function(){
              appBodyRef.upvotedSuccess.set(null);
            }, 2000);

          } else {
            window.analytics.totalPostsUpvoted = window.analytics.totalPostsUpvoted - 1;
            mixpanel.register({
                'totalPostsUpvoted': window.analytics.totalPostsUpvoted
            });

            mixpanel.people.increment({
                'totalPostsUpvoted': -1
            });
          }
        }
      });
    } else {
      mixpanel.track('Upvote attempted');
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

      const comment = Comments.findOne({ _id: commentId });
      mixpanel.track('Commened on a Post', {
        postId: comment.postId,
        commentId: commentId,
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
  "click .post__video-pause": function(event, template){
    event.stopPropagation();
    appBodyRef.state.set(2);
    let selectedId = this._id;
    window['scplayer-' + selectedId].pause();
  },
  "click .post__video": function(event, template){
    let selectedId = this._id;
    let selectedType = this.type;
    let selectedPost = Posts.findOne(selectedId);
    let nowPlaying = appBodyRef.nowPlaying.get();
    let state = appBodyRef.state.get();

    if (selectedType === 'youtube') {
      if (nowPlaying && nowPlaying._id === selectedId) {
        if (state === 1) {
          appBodyRef.state.set(2);
          window['ytplayer'].pauseVideo();
        } else {
          appBodyRef.state.set(1);
          window['ytplayer'].playVideo();
        }
      } else {
        appBodyRef.nowPlaying.set(selectedPost);
      }
    } else {
      if (nowPlaying && nowPlaying._id === selectedId) {
        if (state === 1) {
          appBodyRef.state.set(2);
          window['scplayer-' + selectedId].pause();
        } else {
          appBodyRef.state.set(1);
          window['scplayer-' + selectedId].play();
        }
      } else {
        appBodyRef.nowPlaying.set(selectedPost);
        appBodyRef.state.set(1);
        window['scplayer-' + selectedId].play();
      }
    }

    mixpanel.track('Clicked play button', {
      area: 'Feed'
    });
  },
  "click .share-dropdown__social": function(event, template){
    window.open($(event.currentTarget).data('href'), 'Title', 'width=800,height=500');

    mixpanel.track('Shared Song', {
      platform: $(event.currentTarget).text()
    });

    window.analytics.totalPostsShared = window.analytics.totalPostsShared + 1;
    mixpanel.register({
        'totalPostsShared': window.analytics.totalPostsShared
    });

    mixpanel.people.increment({
        'totalPostsShared': 1
    });
  },
  "click .share-dropdown__copy": function(event, template){
    var $temp = $("<input>");
    $("body").append($temp);
    let base = window.location.href;
    if (base.charAt(base.length-1) !== '/') {
      $temp.val(base+'/post/'+this._id).select();
    } else {
      $temp.val(base+'post/'+this._id).select();
    }
    document.execCommand("copy");
    $temp.remove();
    $('.share-dropdown__copy#share-'+this._id).addClass('share-dropdown__copy--active');

    mixpanel.track('Shared Song', {
      platform: 'Copy'
    });

    window.analytics.totalPostsShared = window.analytics.totalPostsShared + 1;
    mixpanel.register({
        'totalPostsShared': window.analytics.totalPostsShared
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
