import { Template } from 'meteor/templating';

import './feed.html';


Template.feed.helpers({
  posts() {
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
      return 'post__rating--active';
    else
      return '';
  },
  mobileUpvoted: function() {
    if(_.contains(this.upvotedBy, Meteor.userId()))
      return 'upvote-block--active';
    else
      return '';
  },
  upvoterOthers: function() {
    if (this.upvotedBy.length > 3) {
      return ' and ' + (this.upvotedBy.length - 3) + ' others';
    }
  }
});

Template.feed.events({
  "click .post__comments": function(event, template){
    let id = $('.post__comments').data('id');
    console.log(id);
    let comment = $('.comments-block[data-id="' + id +'"]');
    let send = $('.send-to-friend[data-id="' + id +'"]');

    $('.post__send').removeClass('active');
    $('.post__comments').addClass('active');
    send.hide();
    comment.show();
  },
  "click .post__send": function(event, template){
    let id = $('.post__send').data('id');
    let comment = $('.comments-block[data-id="' + id +'"]');
    let send = $('.send-to-friend[data-id="' + id +'"]');

    $('.post__comments').removeClass('active');
    $('.post__send').addClass('active');
    comment.hide();
    send.show();
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
  }
});
