Template.request_village_popup.events({
  'click .request-village-popup__overlay': () => {
    appBodyRef.showRequestVillagePopup.set(false);
  },
  'click .request-village-popup__selection__item, click .request-village-popup__selection__item button': (event) => {
    let item = $(event.target).closest('.request-village-popup__selection__item');
    let category = item.data('category');
    requestVillageRef.category.set(category);
    $('.request-village-popup__selection__item').removeClass('selected');
    item.addClass('selected');
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
    const category = requestVillageRef.category.get();

    if(requestVillageRef.category.get() && requestVillageRef.email.get()) {
      Meteor.call('requestVillage', email , category, () => {
        appBodyRef.showRequestVillagePopup.set(false);
        requestVillageRef.showSuccessPopup.set(true);
      });
    }

    return false;
  },
  'click .request-village-success-popup button': () => {
    requestVillageRef.showSuccessPopup.set(false);
  }
})
