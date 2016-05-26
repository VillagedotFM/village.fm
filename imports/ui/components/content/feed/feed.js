import { YTPlayer } from 'meteor/hpx7:youtube-iframe-player';

import './feed.html';

yt = new YTPlayer('ytplayer', {
  height: '270px',
  width: '479px'
});

Template.feed.onCreated(function feedOnCreated() {
  this.videoReady = new ReactiveVar(false);
});

Template.feed.onRendered(function feedOnRendered() {
  const feedRef = this;

  feedRef.autorun(function () {
    if (appBodyRef.postOrder.get().length > 0) {
      let orderedPosts = appBodyRef.postOrder.get();

      //TODO: refactor after soundcloud
      if (orderedPosts[0].type === 'youtube') { //if first post is youtube video
        let yt_id = orderedPosts[0].vidId;
        if (yt.ready()) {
          feedRef.videoReady.set(true);
          yt.player.cueVideoById(yt_id);

          yt.player.addEventListener('onStateChange', function (event) {
            if(event.data === 0){
              console.log('ENDED');
            } else if(event.data === 1){
              console.log('PLAYING');
              appBodyRef.nowPlaying.set(orderedPosts[0]);
            } else if(event.data === 2){
              console.log('PAUSED');
            }

            let state = event.data;
            appBodyRef.state.set(state);

            //TODO: move getCurrentTime to helper?
            setInterval(function(){ //Track video progress for scrubber
              var completed = yt.player.getCurrentTime();
              appBodyRef.completed.set(completed)
            }, 100);
          });
        }
      }
    }
  });
});


Template.feed.helpers({
  posts() {
    //Check if profile
    let id = FlowRouter.getParam('_id');
    var user = _.findWhere(Meteor.users.find().fetch(), {_id: id});
    var posts;

    if (user) {
      let profileTab = Session.get('profileTab');
      if (profileTab === 'mutual')
        posts = Posts.find({"upvotedBy": {$all: [user._id, Meteor.userId()]}}, {sort: {createdAt: -1}});
      else if (profileTab === 'upvotes')
        posts = Posts.find({"upvotedBy": user._id}, {sort: {createdAt: -1}});
      else if (profileTab === 'posts')
        posts = Posts.find({"createdBy": user._id}, {sort: {createdAt: -1}});
    } else {  //Time Filters
      let time = Session.get('timeFilter');

      let date = new Date();
      let time_filter = new Date();

      if (time === 'day')
      time_filter.setDate(date.getDate()-1);
      else if (time === 'week')
      time_filter.setDate(date.getDate()-7);
      else if (time === 'year')
      time_filter.setDate(date.getDate()-365);

      posts = Posts.find({"createdAt" : { $gte : time_filter }}, {sort: {upvotes:-1, lastUpvote:-1}});
    }

    //TODO: Refactor when playlist order is fixed
    if (posts) {
      appBodyRef.postOrder.set(posts.fetch());
      return posts;
    }
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
  },
  videoReady: function() {
    return Template.instance().videoReady.get();
  },
});

Template.feed.events({
  "click .post__comments": function(event, template){
    let id = $('.post__comments').data('id');
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
  },
  "click .post__video-play": function(event, template){
    //TODO: find which video to play
    yt.player.playVideo();
  }
});
