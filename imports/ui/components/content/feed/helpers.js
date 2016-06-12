Template.feed.helpers({
  posts() {

    //Check if profile
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
      time_filter.setDate(date.getDate()-1);
      else if (time === 'week')
      time_filter.setDate(date.getDate()-7);
      else if (time === 'year')
      time_filter.setDate(date.getDate()-365);

      posts = Posts.find({"createdAt" : { $gte : time_filter }}, {sort: {upvotes:-1, lastUpvote:-1}});
    }

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
