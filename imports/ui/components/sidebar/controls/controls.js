import './controls.html';



Template.controls.helpers({
});

Template.controls.events({
  "click .sr-controls__play": function(event, template){
    if (appBodyRef.nowPlaying.get()) {
      //Play
    } else {
      //Grab first post?
    }
  }
});
