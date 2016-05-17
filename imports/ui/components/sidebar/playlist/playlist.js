import './playlist.html';



Template.playlist.helpers({
  posts: function(){
    return Posts.find();
  }
});
