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
      time_filter.setDate(date.getDate()-1);
      else if (time === 'week')
      time_filter.setDate(date.getDate()-7);
      else if (time === 'year')
      time_filter.setDate(date.getDate()-365);

      posts = Posts.find({"createdAt" : { $gte : time_filter }}, {sort: {upvotes:-1, lastUpvote:-1}});
    }

    //Set post order
    if (posts) {
      appBodyRef.postOrder.set(posts);
      return posts;
    }
  },
  isUpvoted: function() {
    if(_.contains(this.upvotedBy, Meteor.userId()))
      return 'upvote-block--active';
    else
      return '';
  },
  playOrPause() {
    let state = appBodyRef.state.get();
    return state === 1 ? 'sr-playlist__play--paused' : 'sr-playlist__play--play';
  },
  showEqualizer: function() {
    //if this song is the current post AND it's playing, show equalizer and hide duration
    if (appBodyRef.nowPlaying.get()) {
      return (this._id === appBodyRef.nowPlaying.get()._id && appBodyRef.state.get() === 1);
    } else {
      return false;
    }
  },
  showArrow: function() {
    //TODO: show arrow on scrolled post not now playing
    if (appBodyRef.nowPlaying.get()) {
      return this._id === appBodyRef.nowPlaying.get()._id ? 'sr-playlist__item--active' : '';
    } else {
      return '';
    }
  }
});
