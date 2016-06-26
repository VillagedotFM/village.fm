Template.inbox.events({
  //TODO: reactive-var to hide/show inbox
  "click .sr-inbox__arrow, click .sr-inbox__title": function(event, template){
    $('.sr-playlist__item--inbox').toggle();
    $('.sr-inbox__arrow').toggleClass('fa-caret-up');
  }
});
