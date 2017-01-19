Template.community_area_categories.events({
  'click .vf-community-area__add-new-category button': (event) => {
    communityAreaEditRef.tab.set('categories');
  },
  'click .vf-community-area__category': (event) => {
    communityAreaRef.category.set(event.currentTarget.id);
  }
})
