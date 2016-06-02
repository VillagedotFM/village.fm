Template.tabs.helpers({
  activeTime(time){
    return time == appBodyRef.timeFilter.get() ? 'active' : '';
  }
});
