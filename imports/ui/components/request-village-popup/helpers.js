Template.request_village_popup.helpers({
  'showRequestVillagePopup': () => {
    return appBodyRef.showRequestVillagePopup.get();
  },
  'invalidEmail': () => {
    return (requestVillageRef.email.get() === false);
  },
  'showSuccessPopup': () => {
    return requestVillageRef.showSuccessPopup.get();
  }
})
