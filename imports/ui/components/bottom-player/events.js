Template.bottom_player.events({
  'click .bottom-player': function(event, template){
      $('.bottom-player').hide();
      $('.now-playing').show();
      $('html, body').addClass('overflow-hidden');
      $('.main, .header').addClass('blur');
  },
  "click .upvote-block": function(event, template){
    //TODO: upvoting a post stops it...
    if(Meteor.userId()) {
      let upvotedPost = this;
      Meteor.call('upvotePost', upvotedPost._id, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(upvotedPost);
        }
      });
    } else {
      alert('Please login to upvote posts!');
    }
  },
});
