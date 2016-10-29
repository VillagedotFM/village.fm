Template.content.helpers({
  ifVillageSlug() {
    return FlowRouter.getParam('villageSlug');
  },
  isTuneIn() {
    if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
      return false;
    } else {
      return FlowRouter.getParam('villageSlug') === 'tuneintelaviv';
    }
  }
});
