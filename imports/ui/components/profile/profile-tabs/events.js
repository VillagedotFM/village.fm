Template.profile_tabs.events({
  "click .profileTab"(event, instance){
    appBodyRef.profileTab.set($(event.target).data('tab'));
  }
});
