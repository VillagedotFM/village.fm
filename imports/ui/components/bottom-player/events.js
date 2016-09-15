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
          if(affected){
            let postedBy = Meteor.users.findOne(upvotedPost.createdBy);
            mixpanel.track('Upvoted a Post', {
              postId: upvotedPost._id,
              createdBy: postedBy.profile.name
            });

            window.analytics.totalPostsUpvoted = window.analytics.totalPostsUpvoted + 1
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
      appBodyRef.guestAction.set('upvotePost');
    }
  },
  "change #bottom-slider": function(){
    let duration = '00:' + this.duration; //5:08 -> 00:05:08 for moment weirdness
    let seek = ($('#bottom-slider').val()/100)*(moment.duration(duration, "mm:ss").asSeconds());
    if (this.type === 'youtube') {
      window['ytplayer'].seekTo(seek, true);
      appBodyRef.completed.set(seek);
    } else {
      window['scplayer-'+this._id].seek(seek*1000);
      appBodyRef.completed.set(seek*1000);
    }
  },
});
