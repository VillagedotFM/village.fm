import {postToVote} from "./playlist.js";

Template.playlist.helpers({
    posts() {

        //Check if profile page
        let id = FlowRouter.getParam('_id');
        var user = _.findWhere(Meteor.users.find().fetch(), {_id: id});
        var posts;

        if (user) {
            let profileTab = appBodyRef.profileTab.get();
            if (profileTab === 'mutual')
                posts = Posts.find({"upvotedBy": {$all: [user._id, Meteor.userId()]}}, {sort: {createdAt: -1}});
            else if (profileTab === 'upvotes')
                posts = Posts.find({"upvotedBy": user._id}, {sort: {createdAt: -1}});
            else if (profileTab === 'posts')
                posts = Posts.find({"createdBy": user._id}, {sort: {createdAt: -1}});
        } else {  //Time Filters
            let time = appBodyRef.timeFilter.get();

            let date = new Date();
            let time_filter = new Date();

            if (time === 'day')
                time_filter.setDate(date.getDate() - 1);
            else if (time === 'week')
                time_filter.setDate(date.getDate() - 7);
            else if (time === 'year')
                time_filter.setDate(date.getDate() - 365);

            const villageSlug = FlowRouter.getParam('villageSlug');
            const village = Villages.findOne({slug: villageSlug});
            if(village){
              posts = Posts.find({"villages":  {$in: [village._id]}, "createdAt": {$gte: time_filter}}, {sort: {upvotes: -1, lastUpvote: -1}}).fetch(); 
            } else {
              posts = Posts.find({"createdAt": {$gte: time_filter}}, {sort: {upvotes: -1, lastUpvote: -1}}).fetch(); 
            }
            
        }

    //Inbox
    if (appBodyRef.inboxOpen.get()) {
      var inboxItems = [];
      _.each(Inbox.find({to: Meteor.userId()}).fetch(), function(inboxItem) {
        inboxItems.push(Posts.findOne(inboxItem.postId));
      });
      _.each(inboxItems, function(inboxItem, index) {
        posts.splice(index, 0, inboxItem);
      });
      appBodyRef.postOrder.set(posts);

      let inboxCount = Inbox.find({to: Meteor.userId()}).fetch().length;
      let displayPosts = posts;
      displayPosts.splice(0, inboxCount);
      return displayPosts;
    } else {
      // Global function to check and move if selected post
      GlobalClient.checkAndMoveSelectedPost(posts);

      appBodyRef.postOrder.set(posts);
      return posts;
    }
  },
  showInbox() {
      return appBodyRef.inboxOpen.get();
  },
  inboxItems() {
    var inboxItems = [];
    _.each(Inbox.find({to: Meteor.userId()}).fetch(), function(inboxItem) {
      const post = Posts.findOne(inboxItem.postId);
      if(FlowRouter.getParam('villageSlug')){
        if(post.villageSlug && post.villageSlug == FlowRouter.getParam('villageSlug')){
           inboxItems.push(post);
        }
      } else {
        inboxItems.push(post);
      }
    });
    return inboxItems;
  },
  inboxPost: function () {
      return Posts.findOne(this.postId);
  },
  sentAgo: function (createdAt) {
      return moment(createdAt).fromNow();
  },
  isUpvoted: function () {
      if (_.contains(this.upvotedBy, Meteor.userId()))
          return 'upvote-block--active';
      else
          return '';
  },
  playOrPause: function () {
      if (appBodyRef.nowPlaying.get()) {
          if (this._id === appBodyRef.nowPlaying.get()._id && appBodyRef.state.get() === 1) {
              return 'sr-playlist__play--paused';
          } else {
              return 'sr-playlist__play--play';
          }
      } else {
          return 'sr-playlist__play--play';
      }
  },
  showEqualizer: function () {
      //if this song is the current post AND it's playing, show equalizer and hide duration
      if (appBodyRef.nowPlaying.get()) {
          return (this._id === appBodyRef.nowPlaying.get()._id && appBodyRef.state.get() === 1);
      } else {
          return false;
      }
  },
  showSpinner: function () {
      if (_.findWhere(appBodyRef.displayPosts.get(), {_id: this._id}))
          return 'display';
      else
          return 'hidden';
  },

  postToVote: function () {
      return postToVote.get();
  },

    fakeUsers: function () {
        return Meteor.users.find({
            roles: 'fakeUser'
        }).fetch();
    },
});
