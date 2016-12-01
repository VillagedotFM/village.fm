Template.start_village.events({
  'click .vf-modal.active': () => {
    if($(event.target).is('.vf-modal.active')) {
      startVillageRef.step.set(null);
    }
  },
  'click .start-village__signup .vf-btn': () => {
    startVillageRef.step.set('details');
  },
  'submit .start-village__details__form': () => {
    let villageName = $('.start-village__details__group-name').val().trim();
    if(villageName.length === 0) {
      startVillageRef.validName.set(false);
    } else {
      startVillageRef.validName.set(true);
      startVillageRef.step.set('finish');
    }
    return false;
  },
  'keyup .start-village__details__group-name': (event) => {
    let villageName = event.target.value.trim();
    if(villageName.length === 0) {
      startVillageRef.validName.set(false);
    } else {
      startVillageRef.validName.set(true);
    }
  }
})
