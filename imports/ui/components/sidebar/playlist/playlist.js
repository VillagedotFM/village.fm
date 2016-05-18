

import './playlist.html';



Template.playlist.helpers({
  posts: function(){
    let time = Session.get('timeFilter');

    let date = new Date();
    let time_filter = new Date();
    
    if (time === 'day')
      time_filter.setDate(date.getDate()-1);
    else if (time === 'week')
      time_filter.setDate(date.getDate()-7);
    else if (time === 'year')
      time_filter.setDate(date.getDate()-365);

    return Posts.find({"createdAt" : { $gte : time_filter }}, {sort: {upvotes:-1, lastUpvote:1}});
  },
  isUpvoted: function() {
    if(_.contains(this.upvotedBy, Meteor.userId()))
      return 'upvote-block--active';
    else
      return '';
  },
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
  }
});
