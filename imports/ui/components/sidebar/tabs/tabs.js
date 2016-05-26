import './tabs.html';


Template.tabs.helpers({
  activeTime(time){
    return time == appBodyRef.timeFilter.get() ? 'active' : '';
  }
});

Template.tabs.events({
  "click .timeFilter"(event, instance){
    appBodyRef.timeFilter.set($(event.target).data('time'));
  }
});
