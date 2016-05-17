import './playlist.html';


Template.playlist.onCreated(function playlistOnCreated() {
  this.subscribe('villages.all');
  window.Villages = Villages;
});


Template.playlist.helpers({
  posts: function(){

  }
});
