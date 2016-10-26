Template.request_village_popup.events({
  'click .request-village-popup .popup__overlay': () => {
    appBodyRef.showRequestVillagePopup.set(false);
  },
  'keyup .request-village-popup__form input[type="email"]': (event) => {
    let pattern =  /^[A-Z0-9\._%+-]+@[A-Z0-9\.-]+\.[A-Z]{2,}$/i;
    let email = event.target.value;
    if(pattern.test(email)) {
      requestVillageRef.email.set(email);
    } else {
      requestVillageRef.email.set(false);
    }
  },
  'submit .request-village-popup__form': (event) => {
    const email = requestVillageRef.email.get();

    if(requestVillageRef.email.get()) {
      Meteor.call('requestVillage', email, null, () => {
        appBodyRef.showRequestVillagePopup.set(false);
        requestVillageRef.showSuccessPopup.set(true);
      });
    }

    return false;
  },
  'click .request-village-success-popup button, click .request-village-success-popup .popup__overlay': () => {
    requestVillageRef.showSuccessPopup.set(false);
  }
})
