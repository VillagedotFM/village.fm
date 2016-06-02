Template.tabs.events({
  "click .timeFilter"(event, instance){
    appBodyRef.timeFilter.set($(event.target).data('time'));
  }
});
