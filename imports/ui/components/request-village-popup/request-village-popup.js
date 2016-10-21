import './request-village-popup.html';
import './events.js';
import './helpers.js';

Template.request_village_popup.onCreated(() => {
  requestVillageRef = this;

  requestVillageRef.email = new ReactiveVar(null);
  requestVillageRef.category = new ReactiveVar(null);
  requestVillageRef.showSuccessPopup = new ReactiveVar(false);
})
