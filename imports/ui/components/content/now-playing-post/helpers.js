Template.nowPlayingPost.helpers({
  nowPlaying: function() {
    let nowPlayingPost = appBodyRef.nowPlaying.get();
    if (nowPlayingPost) {
      return nowPlayingPost;
    }
  },
});
