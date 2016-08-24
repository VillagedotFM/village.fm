Template.tabs.events({
  "click .timeFilter"(event, instance){
    appBodyRef.timeFilter.set($(event.target).data('time'));

    mixpanel.track('Clicked Time Filter', {
    	timeframe: $(event.target).data('time')
    });
  }
});
