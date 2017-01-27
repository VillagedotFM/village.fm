Template.community_area_villagers.events({
  'click .vf-community-area__top-villagers-header__view-all': (event) => {
    communityAreaVillagersRef.villagersModalActive.set(true);
  },
  'click .vf-community-area__villagers.active': (event) => {
    if($(event.target).is('.vf-community-area__villagers.active')) {
      communityAreaVillagersRef.villagersModalActive.set(false);
    }
  },
  'click .vf-community-area__villager__make-admin': (event) => {
    const userId = $(event.currentTarget).attr('data-user');
    const villageSlug = FlowRouter.getParam('villageSlug');
    Meteor.call('makeAdmin', userId, villageSlug, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("Made Admin!");
      }
    });
  }
});
