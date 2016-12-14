import { Meteor } from 'meteor/meteor';

import { Villages } from './villages.js';


Meteor.methods({
  createVillage: function (name, description) {
    const newVillage = Villages.insert({
      name: name,
      description: description,
      admins: [Meteor.userId()]
    });

    return newVillage;
  }
});
