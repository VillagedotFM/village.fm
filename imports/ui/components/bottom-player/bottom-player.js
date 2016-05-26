import './bottom-player.html';


Template.bottom_player.helpers({
  isUpvoted: function() {
    if(_.contains(this.upvotedBy, Meteor.userId()))
      return 'upvote-block--active';
    else
      return '';
  },
  nowPlaying: function() {
    let nowPlayingPost = appBodyRef.nowPlaying.get();
    if (nowPlayingPost) {
      return Posts.findOne({_id:nowPlayingPost._id});
    }
  },
  completed: function() {
    let completed = appBodyRef.completed.get();
    var minutes, seconds;
    if (('' + moment.duration(completed, 'seconds')._data.seconds).length === 1) {
      seconds = '0' + moment.duration(completed, 'seconds')._data.seconds;
    } else {
      seconds = moment.duration(completed, 'seconds')._data.seconds;
    }
    minutes = moment.duration(completed, 'seconds')._data.minutes;

    return (minutes + ':' + seconds);
  },
  completedPercentage: function() {
    let completed = appBodyRef.completed.get();
    let duration = '00:' + this.duration;
    let completedPercentage = ''+(moment.duration(completed, 'seconds').asSeconds())/(moment.duration(duration, "mm:ss").asSeconds());
    console.log((completedPercentage.substring(0,5) * 100)+'%');
    return (completedPercentage.substring(0,5) * 100)+'%';
  }
});

Template.bottom_player.events({
  "click .upvote-block": function(event, template){
    if(Meteor.userId()) {
      let upvotedPost = this;
      Meteor.call('upvotePost', upvotedPost._id, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log(upvotedPost);
        }
      });
    } else {
      alert('Please login to upvote posts!');
    }
  },
});
