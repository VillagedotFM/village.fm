Template.community_area_villagers.events({
  'click .vf-community-area__top-villager': (event) => {
    $('.vf-community-area__top-villager').removeClass('active');
    $(event.currentTarget).addClass('active');
  },
  'click .vf-community-area__top-villagers-header__view-all': (event) => {
    communityAreaVillagersRef.villagersModalActive.set(true);
  },
  'click .vf-community-area__villagers.active': () => {
    if($(event.target).is('.vf-community-area__villagers.active')) {
      communityAreaVillagersRef.villagersModalActive.set(false);
    }
  }
});
