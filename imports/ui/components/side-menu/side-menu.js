import './side-menu.html';
import './events.js';
import './helpers.js';

import './side-menu-profile/side-menu-profile.js';

Template.side_menu.onCreated(() => {
  Meteor.subscribe("villages.sideMenu");

});


Template.side_menu.onRendered(() => {


})
