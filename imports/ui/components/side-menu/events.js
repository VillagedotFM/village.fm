Template.side_menu.events({
  'click .vf-side-menu__start-village, click .vf-side-menu__villages__start-village': () => {
    if (Meteor.userId()) {
      startVillageRef.step.set('details');
    } else {
      startVillageRef.step.set('signup');
    }
  }
})
