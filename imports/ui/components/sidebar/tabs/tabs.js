import './tabs.html';

Template.tabs.onRendered(function tabsOnRendered() {
  Session.set('timeFilter', 'week');
});

Template.tabs.helpers({
  activeTime(time){
    return time == Session.get('timeFilter') ? 'active' : '';
  }
});

Template.tabs.events({
  "click .timeFilter"(event, instance){
    Session.set('timeFilter', $(event.target).data('time'));
  }
});
