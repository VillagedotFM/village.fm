Template.community_area_categories.events({
  'click .vf-community-area__add-new-category button': (event) => {
    communityAreaEditRef.tab.set('categories');
  },
  'click .vf-community-area__category': (event) => {
    let villageSlug = FlowRouter.getParam('villageSlug') || "all";
    FlowRouter.go('/'+villageSlug+'/'+event.currentTarget.id);
  }
})
