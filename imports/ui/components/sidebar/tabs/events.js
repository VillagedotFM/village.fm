Template.tabs.events({
  "click .timeFilter"(event, instance){
    $('.sr-playlist').scrollTop(0);
    $('.wrapper').scrollTop(0);
    appBodyRef.timeFilter.set($(event.target).data('time'));

    mixpanel.track('Clicked Time Filter', {
    	timeframe: $(event.target).data('time')
    });
  }
});
