import { Meteor } from 'meteor/meteor';

import { Villages } from './villages.js';


Meteor.methods({
  createVillage: function (name, description) {
    let slug = name.replace(' ', '').toLowerCase();

    Villages.insert({
      name: name,
      description: description,
      admins: [Meteor.userId()]
    });

  }
});
