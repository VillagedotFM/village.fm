Template.now_playing_popup.helpers({
  nowPlaying: function() {
    let nowPlayingPost = appBodyRef.nowPlaying.get();
    if (nowPlayingPost) {
      return nowPlayingPost;
    }
  },
  completed: function() {

    setInterval(function(){ //Track video progress for scrubber, convert to seconds if SC
      let post = appBodyRef.nowPlaying.get();
      if (post.type === 'youtube') {
        var completed = window['ytplayer-'+post._id].getCurrentTime();
        appBodyRef.completed.set(completed)
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
  },
  postedAgo: function() {
    return moment(this.createdAt).fromNow();
  },
  //player__controls__play--paused
  playOrPause: function() {
    let state = appBodyRef.state.get();
    let now = appBodyRef.nowPlaying.get();
    let time = appBodyRef.completed.get();
    // if (this.type === 'youtube') {
    //   if (window['ytplayer-'+ this._id].getPlayerState() === 1){
    //     return 'player__controls__play--paused';
    //   } else {
    //     return 'player__controls__play--play';
    //   }
    // } else {
    //   return window['scplayer-'+ this._id].isPlaying() ? 'player__controls__play--paused' : 'player__controls__play--play';
    // }
    return window['state-'+this._id] === 1 ? 'player__controls__play--paused' : 'player__controls__play--play';
  }
});
