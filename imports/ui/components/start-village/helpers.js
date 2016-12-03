Template.start_village.helpers({
  'signUpModalActive': () => {
    return startVillageRef.step.get() === 'signup' ? true : false;
  },
  'detailsModalActive': () => {
    return startVillageRef.step.get() === 'details' ? true : false;
  },
  'finishModalActive': () => {
    return startVillageRef.step.get() === 'finish' ? true : false;
  },
  'validName': () => {
    return startVillageRef.validName.get();
  },
  'newVillage': () => {
    const newVillageId = startVillageRef.newVillage.get();
    return Villages.findOne(newVillageId);
  }
})
