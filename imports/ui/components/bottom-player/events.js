Template.bottom_player.events({
  'click .bottom-player': function(event, template){
    if (appBodyRef.mobile.get()) {
      $('.bottom-player').hide();
      $('.now-playing').show();
      $('html, body').addClass('overflow-hidden');
      $('.main, .header').addClass('blur');
    }
  },
  "click .upvote-block": function(event, template){
    event.stopPropagation();
    //TODO: upvoting a post stops it...
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
});
