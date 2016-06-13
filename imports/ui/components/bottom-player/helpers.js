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

    setInterval(function(){ //Track video progress for scrubber, convert to seconds if SC
      let post = appBodyRef.nowPlaying.get();
      if (post.type === 'youtube') {

      } else {
        let completed = window['scplayer-'+post._id].currentTime();
        appBodyRef.completed.set(completed / 1000)
      }
    }, 500);

    let completed = appBodyRef.completed.get();   //Get current time of video
    var minutes, seconds;

    if (('' + moment.duration(completed, 'seconds')._data.seconds).length === 1) {  //0:1 -> 0:01
      seconds = '0' + moment.duration(completed, 'seconds')._data.seconds;
    } else {
      seconds = moment.duration(completed, 'seconds')._data.seconds;  //Leave 0:25 as is
    }

    minutes = moment.duration(completed, 'seconds')._data.minutes;

    return (minutes + ':' + seconds);
  },
  completedPercentage: function() { //For progress bar
    let completed = appBodyRef.completed.get();
    let duration = '00:' + this.duration; //5:08 -> 00:05:08 for moment weirdness

    //Divide current time in seconds by duration in seconds to get 0.XXXXXXX percentage
    let completedPercentage = ''+(moment.duration(completed, 'seconds').asSeconds())/(moment.duration(duration, "mm:ss").asSeconds());

    //Only take first 5 characters (including decimal) so 0.XXX, multiple by 100 and add % -> "XX.X%"
    return (completedPercentage.substring(0,5) * 100)+'%';
  }
});
