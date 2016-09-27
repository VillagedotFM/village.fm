import {postToVote} from "./playlist.js";

Template.playlist.helpers({
    posts() {

        //Check if profile page
        let id = FlowRouter.getParam('_id');
        var user = _.findWhere(Meteor.users.find().fetch(), {_id: id});
        var posts;

        let selector = {};
        let options = {};


        if (user) {
            options = {
              sort: {createdAt: -1},
              limit: appBodyRef.postsLoaded.get()
            };
            let profileTab = appBodyRef.profileTab.get();
            if (profileTab === 'mutual'){
                selector = {"upvotedBy": {$all: [user._id, Meteor.userId()]}};
            } else if (profileTab === 'upvotes'){
                selector = {"upvotedBy": user._id};
            } else if (profileTab === 'posts'){
                selector = {"createdBy": user._id};
            }
        } else {  //Time Filters
            options = {
              sort: {upvotes: -1, lastUpvote: 1},
              limit: appBodyRef.postsLoaded.get()
            };
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
              selector = {"villages":  {$in: [village._id]}, "createdAt": {$gte: time_filter}};
            } else {
              selector = {"createdAt": {$gte: time_filter}};
            }

        }

        posts = Posts.find(selector, options).fetch();

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

      if(posts && posts.length > 0 ){
        appBodyRef.postsLoadedDone.set(true);
      }

      return posts;
    }
  },
  skeletonPosts(postLength){
    if(!appBodyRef.postsLoadedDone.get()){
      return [0, 1, 2, 3, 4, 5, 6, 7];
    }

  },
  // showInbox() {
  //     return appBodyRef.inboxOpen.get();
  // },
  // inboxItems() {
  //   var inboxItems = [];
  //   _.each(Inbox.find({to: Meteor.userId()}).fetch(), function(inboxItem) {
  //     const post = Posts.findOne(inboxItem.postId);
  //     if(FlowRouter.getParam('villageSlug')){
  //       if(post.villageSlug && post.villageSlug == FlowRouter.getParam('villageSlug')){
  //          inboxItems.push(post);
  //       }
  //     } else {
  //       inboxItems.push(post);
  //     }
  //   });
  //   return inboxItems;
  // },
  // inboxPost: function () {
  //     return Posts.findOne(this.postId);
  // },
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
    let state = appBodyRef.state.get();
    let nowPlaying = appBodyRef.nowPlaying.get();

    if (nowPlaying) {
      if (this._id === nowPlaying._id) {
        return state === 1 ? 'sr-playlist__play--paused' : 'sr-playlist__play--play';
      } else {
        return 'sr-playlist__play--play';
      }
    } else {
      return 'sr-playlist__play--play';
    }
  },
  showEqualizer: function () {
    let state = appBodyRef.state.get();
    let nowPlaying = appBodyRef.nowPlaying.get();

    if (nowPlaying) {
      if (this._id === nowPlaying._id) {
        return state === 1 ? true : false;
      } else {
        return false;
      }
    } else {
      return false;
    }
  },
  showSpinner: function () {
    let state = appBodyRef.state.get();
    let nowPlaying = appBodyRef.nowPlaying.get();

    if (nowPlaying && nowPlaying.type === 'youtube') {
      if (this._id === nowPlaying._id) {
        return (state === 1 || state === 2) ? 'hidden' : 'display';
      } else {
        return 'hidden';
      }
    } else {
      return 'hidden';
    }
  },

  postToVote: function () {
      return postToVote.get();
  },

  fakeUsers: function () {
      return Meteor.users.find({
          roles: 'fakeUser'
      }).fetch();
  },
  isSubVillage: function() {
    return FlowRouter.getParam('villageSlug');
  }
});
