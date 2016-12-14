Template.community_area_villagers.events({
  'click .vf-community-area__villager': (event) => {
    $('.vf-community-area__villager').removeClass('active');
    $(event.currentTarget).addClass('active');
  }
});
