Template.feed.helpers({
  posts() {
    return appBodyRef.postOrder.get();
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
  currentVideoReady: function() { //Redundant of General helper but necessary because of weirdness
    return appBodyRef.videoReady.get();
  },
  isYoutube(type) {
    if (type === 'youtube') {
      return true;
    } else {
      return false;
    }
  }
});
