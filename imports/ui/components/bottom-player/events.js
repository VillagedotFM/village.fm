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
      Meteor.call('upvotePost', upvotedPost._id, function(err, data) {
        if (err) {
          appBodyRef.upvotedError.set(true);
        } else {
          if(!(_.contains(upvotedPost.upvotedBy, Meteor.userId()))){
            appBodyRef.upvotedSuccess.set(upvotedPost);
            setTimeout(function(){
              appBodyRef.upvotedSuccess.set(null);
            }, 2000);
          }
        }
      });
    } else {
      appBodyRef.guestAction.set('upvotePost');
    }
  },
});
