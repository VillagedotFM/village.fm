import { Villages } from '../../../../api/villages/villages.js';

Template.community_area_categories.helpers({
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
    return _.contains(this.admins, Meteor.userId());
  },
  'activeCategory': (name) => {
    return communityAreaRef.category.get() === name;
  }
})
