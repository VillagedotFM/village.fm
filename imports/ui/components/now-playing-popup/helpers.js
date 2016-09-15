Template.now_playing_popup.helpers({
  nowPlaying: function() {
    let nowPlayingPost = appBodyRef.nowPlaying.get();
    if (nowPlayingPost) {
      return nowPlayingPost;
    }
  },
  postedAgo: function() {
    return moment(this.createdAt).fromNow();
  },
  playOrPause: function() {
    let state = appBodyRef.state.get();
    return state === 1 ? 'player__controls__play--paused' : 'player__controls__play--play';
  }
});
