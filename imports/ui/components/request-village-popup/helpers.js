Template.request_village_popup.helpers({
  'showRequestVillagePopup': () => {
    return appBodyRef.showRequestVillagePopup.get();
  },
  'invalidEmail': () => {
    return (requestVillageRef.email.get() === false);
  },
  invalidRequest: () => {
    return !(requestVillageRef.category.get() && requestVillageRef.email.get());
  },
  "showSuccessPopup": () => {
    return requestVillageRef.showSuccessPopup.get();
  }
})
