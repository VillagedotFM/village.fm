import './side-menu.html';
import './events.js';
import './helpers.js';

Template.side_menu.onCreated(() => {
  Meteor.subscribe("villages.sideMenu");

});


Template.side_menu.onRendered(() => {


})
