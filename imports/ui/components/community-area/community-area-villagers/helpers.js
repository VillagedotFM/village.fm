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
  },
  onlyOneUser: function() {
    let users = this.users.length + this.admins.length;
    return users === 1;
  },
  allUsers: function() {
    const allUsers = this.admins.concat(this.users);
    let leaderboard = [];

    allUsers.forEach(function(userId) {
      let posts = Posts.find({"createdBy": userId}).fetch();
      let upvotesCollected = 0;
      posts.forEach(function (post) {
        upvotesCollected += post.upvotes;
      });

      let object = {id: userId, votes: upvotesCollected};
      leaderboard.push(object);
    });

    leaderboard.sort(function(a, b) {
        var x = a.votes; var y = b.votes;
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });

    leaderboard = leaderboard.reverse();

    return leaderboard.slice(0,9);
  }
})
