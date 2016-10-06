Template.tabs.events({
  "click .timeFilter"(event, instance){
    $('.sr-playlist').scrollTop(0);
    $('.wrapper').scrollTop(0);
    $('body').scrollTop(0);
    appBodyRef.timeFilter.set($(event.target).data('time'));

    appBodyRef.postsLoaded.set(20);
    appBodyRef.postsLoadedDone.set(false);
    appBodyRef.allPostsLoadedDone.set(false);
    Tracker.flush();

    mixpanel.track('Clicked Time Filter', {
    	timeframe: $(event.target).data('time')
    });
  }
});
