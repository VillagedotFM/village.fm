import './start-village.html';
import './events.js';
import './helpers.js';

Template.start_village.onCreated(function() {
  startVillageRef = this;
  startVillageRef.step = new ReactiveVar(null);
  startVillageRef.validName = new ReactiveVar(true);
});
