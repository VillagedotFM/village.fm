

import './playlist.html';



Template.playlist.helpers({
  posts: function(){

    //Check if profile
    let id = FlowRouter.getParam('_id');
    var user = _.findWhere(Meteor.users.find().fetch(), {_id: id});

    if (user) {
      var posts;
      let profileTab = Session.get('profileTab');
      if (profileTab === 'mutual')
        posts = Posts.find({"upvotedBy": {$all: [user._id, Meteor.userId()]}}, {sort: {createdAt: -1}});
      else if (profileTab === 'upvotes')
        posts = Posts.find({"upvotedBy": user._id}, {sort: {createdAt: -1}});
      else if (profileTab === 'posts')
        posts = Posts.find({"createdBy": user._id}, {sort: {createdAt: -1}});

      return posts;
    }

    let time = Session.get('timeFilter');

    let date = new Date();
    let time_filter = new Date();

    if (time === 'day')
      time_filter.setDate(date.getDate()-1);
    else if (time === 'week')
      time_filter.setDate(date.getDate()-7);
    else if (time === 'year')
      time_filter.setDate(date.getDate()-365);

    return Posts.find({"createdAt" : { $gte : time_filter }}, {sort: {upvotes:-1, lastUpvote:-1}});
  },
  isUpvoted: function() {
    if(_.contains(this.upvotedBy, Meteor.userId()))
      return 'upvote-block--active';
    else
      return '';
  },
  playOrPause() {
    let state = appBodyRef.state.get();
    return state === 1 ? 'sr-playlist__play--paused' : 'sr-playlist__play--play';
  }
});


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
    //TODO: find which video to play
    yt.player.playVideo();
  },
  "click .sr-playlist__play--paused": function(event, template){
    //TODO: find which video to pause
    yt.player.pauseVideo();
  }
});
