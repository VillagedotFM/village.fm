import { Villages } from '../../../../api/villages/villages.js';

Template.community_area_villagers.helpers({
  'villagersModalActive': () => {
    return communityAreaVillagersRef.villagersModalActive.get();
  },
  'currentVillage': () => {
    const villageSlug = FlowRouter.getParam('villageSlug');
    let village;

    if (villageSlug) {    //Handle main village (no slug)
      village = Villages.findOne({'friendlySlugs.slug.base': villageSlug});
    } else {
      village = Villages.findOne({'friendlySlugs.slug.base': "main"});
    }

    if (village) {
      return village;
    }
  },
  'isAdmin': function() {
    const villageSlug = FlowRouter.getParam('villageSlug');
    let village;

    if (villageSlug) {    //Handle main village (no slug)
      village = Villages.findOne({'friendlySlugs.slug.base': villageSlug});
    } else {
      village = Villages.findOne({'friendlySlugs.slug.base': "main"});
    }

    if (village) {
      return _.contains(village.admins, Meteor.userId());
    }
  },
  totalUsers: function() {
    return this.users.length + this.admins.length;
  }
})
