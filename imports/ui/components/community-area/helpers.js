import { Villages } from '../../../api/villages/villages.js';

Template.community_area.helpers({
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
  'inviteButtonActive': () => {
    return communityAreaRef.inviteButtonActive.get();
  },
  'villageLinkCopied': () => {
    return communityAreaRef.villageLinkCopied.get();
  },
  'joined': () => {
    return communityAreaRef.joined.get();
  },
  totalUsers: function() {
    return this.users.length + this.admins.length;
  }
})
