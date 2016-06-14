Template.feed.helpers({
  posts() {
    return appBodyRef.displayPosts.get();
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
    if (this.upvotedBy.length > 3) {
      return ' and ' + (this.upvotedBy.length - 3) + ' others';
    }
  },
  getNextYTPlayer: function() {
    return window.getNextYTPlayer().id;  //grab the id of the next available yt player
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
  }
});
