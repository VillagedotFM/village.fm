import { Meteor } from 'meteor/meteor';

import { Villages } from './villages.js';


Meteor.methods({
  createVillage: function (name, description) {
    const newVillage = Villages.insert({
      name: name,
      description: description,
      admins: [Meteor.userId()]
    });

    mixpanel.track('Created Village', {
      villageName: name,
      createdBy: Meteor.userId()
    });
    return newVillage;
  },
  joinVillage: function(villageId) {
    Villages.update({_id: villageId}, {
      $addToSet: {
        users: Meteor.userId()
      }
    });

    let village = Villages.findOne({villageId});

    mixpanel.track('Joined Village', {
      villageName: village.name,
      user: Meteor.userId()
    });
  },
  editVillage: function(villageId, changes) {

    Villages.update({_id: villageId}, {
      $set: {
        'name': changes.name,
        'description': changes.description,
        'youtube': changes.youtube,
        'website': changes.website,
        'twitter': changes.twitter,
        'facebook': changes.facebook,
      },
      $push: {
        categories: { $each: changes.categories }
      }
    });
  }
});
