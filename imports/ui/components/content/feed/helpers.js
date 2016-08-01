Template.feed.helpers({
  posts() {
    if (appBodyRef.inboxOpen.get()) {
      let inboxCount = Inbox.find({to: Meteor.userId()}).fetch().length;
      let displayPosts = appBodyRef.displayPosts.get();
      displayPosts.splice(0, inboxCount);
      return displayPosts;
    } else {
      return appBodyRef.displayPosts.get();
    }
  },
  showInbox() {
    return appBodyRef.inboxOpen.get();
  },
  selectedPost() {
    return FlowRouter.current().params.postId;
  },
  inboxItems() {
    var inboxItems = [];
    _.each(Inbox.find({to: Meteor.userId()}).fetch(), function(inboxItem) {
      inboxItems.push(Posts.findOne(inboxItem.postId));
    });
    return inboxItems;
  },
  comments: function() {
    return Comments.find({postId: this._id}).fetch();
  },
  isPlaying: function() {
    if (appBodyRef.nowPlaying.get()) {
      return (this._id === appBodyRef.nowPlaying.get()._id && appBodyRef.state.get() === 1);
    }
    return false;
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
  videoReady: function(index) {          //Redundant of General helper but necessary because of weirdness
    return (_.contains(appBodyRef.videosReady.list(), index));
  },
  isYoutube() {
    if (this.type === 'youtube') {
      return true;
    } else {
      return false;
    }
  },
  rank(index) {
    return index + 1;
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
    return window.location.host;
  }
});
