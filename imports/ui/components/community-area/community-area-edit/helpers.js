Template.community_area_edit.helpers({
  'selectedTab': () => {
    return communityAreaEditRef.tab.get();
  },
  'validName': () => {
    return communityAreaEditRef.validName.get();
  }
})
