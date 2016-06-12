Template.feed.helpers({
  posts() {
    let posts = appBodyRef.postOrder.get().fetch();
    //Number of posts to display after a user scrolls to the bottom.
    //Their first visit = 5, scroll to the bottom once = 10, twice = 15...
    let lastIndex = (appBodyRef.bottomHits.get() * 5) + 5;

    if (lastIndex < posts.length) { //make sure there are enough posts
      return posts.slice(0, lastIndex);
    } else {
      return posts.slice(0, posts.length);
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
