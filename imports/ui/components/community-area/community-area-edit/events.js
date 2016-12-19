Template.community_area_edit.events({
  'click .vf-community-area__edit-village.active': () => {
    if($(event.target).is('.vf-community-area__edit-village.active')) {
      communityAreaEditRef.tab.set(null);
    }
  },
  'click .vf-community-area__edit-village__tabs li': (event) => {
    communityAreaEditRef.tab.set(event.target.dataset.tab)
  },
  'keyup .vf-community-area__edit-village__group-name': (event) => {
    let villageName = event.target.value.trim();
    if(villageName.length === 0) {
      communityAreaEditRef.validName.set(false);
    } else {
      communityAreaEditRef.validName.set(true);
    }
  },
  'submit .vf-community-area__edit-village__form': () => {
    let villageName = $('.vf-community-area__edit-village__group-name').val().trim();
    if(villageName.length === 0) {
      communityAreaEditRef.validName.set(false);
    } else {
      communityAreaEditRef.validName.set(true);
    }
    return false;
  },
})
