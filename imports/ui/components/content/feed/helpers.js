Template.feed.helpers({
  posts() {
    // if (appBodyRef.inboxOpen.get()) {
    //   let inboxCount = Inbox.find({to: Meteor.userId()}).fetch().length;
    //   let displayPosts = appBodyRef.displayPosts.get();
    //   displayPosts.splice(0, inboxCount);
    //   return displayPosts;
    // } else {
      return appBodyRef.displayPosts.get();
    // }
  },
  // showInbox() {
  //   return appBodyRef.inboxOpen.get();
  // },
  selectedPost() {
    return FlowRouter.current().params.postId;
  },
  // inboxItems() {
  //   var inboxItems = [];
  //   _.each(Inbox.find({to: Meteor.userId()}).fetch(), function(inboxItem) {
  //     inboxItems.push(Posts.findOne(inboxItem.postId));
  //   });
  //   return inboxItems;
  // },
  comments: function() {
    return Comments.find({postId: this._id}).fetch();
  },
  isPlaying: function() {
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
    if (this.upvotes > 3) {
      return ' and ' + (this.upvotes - 3) + ' others';
    }
  },
  vidReady: function(index) {
    let nowPlaying = appBodyRef.nowPlaying.get();
    let state = appBodyRef.state.get();

    if (nowPlaying && nowPlaying.type === 'youtube') {
      if (this._id === nowPlaying._id) {
        return (state === 1 || state === 2) ? true : false;
      } else {
        return true;
      }
    } else {
      return true;
    }
  },
  isYoutube() {
    if (this.type === 'youtube') {
      return true;
    } else {
      return false;
    }
  },
  rank(index) {
    return FlowRouter.current().params.postId ? index : index + 1;
  },
  notSelectedPost(index) {
    return index === 0 && FlowRouter.current().params.postId;
  },
  postedAgo: function() {
    return moment(this.createdAt).fromNow();
  },
  replyTo: function(id) {
    return (id === appBodyRef.replyTo.get());
  },
  commentUpvoted: function(){
    if(_.contains(this.likes, Meteor.userId()))
      return 'upvote-block--active';
    else
      return '';
  },
  settings() {
    return {
      position: "below",
      limit: 5,
      rules: [
        {
          token: '',
          collection: Meteor.users,
          field: "profile.name",
          template: Template.userPill
        }
      ]
    };
  },
  // Get current window location
  currentUrl() {
    return window.location.origin;
  },
  postUrl(id) {
    const post = Posts.findOne({_id: id});
    if(post){
      const village = Villages.findOne({_id: post.villages[0]});
      if(village && village.slug){
        if(village.name != 'Main'){
          return '/' + village.slug + '/post/' + id;
        }
      }
    }

    return '/post/' + id;
  },
  isSubVillage() {
    return FlowRouter.getParam('villageSlug');
  },
  // loadIframe: function() {
  //   return (_.findWhere(appBodyRef.loadIframe.list(), {'_id':this._id}));
  // }
});
