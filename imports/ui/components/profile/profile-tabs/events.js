Template.profile_tabs.events({
  "click .profileTab"(event, instance){
    appBodyRef.profileTab.set($(event.target).data('tab'));

    mixpanel.track('Clicked Time Filter', {
    	type: ( Meteor.userId() === FlowRouter.getParam('_id') ? 'Own Profile' : 'Other Profile'),
    	filter: $(event.target).data('tab')
    });
  }
});
