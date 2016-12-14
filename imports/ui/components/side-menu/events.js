Template.side_menu.events({
  'click .side-menu__start-village': () => {
    if (Meteor.userId()) {
      startVillageRef.step.set('details');
    } else {
      startVillageRef.step.set('signup');
    }
  }
})
