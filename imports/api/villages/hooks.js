import { Meteor } from 'meteor/meteor';

import { Villages } from './villages.js';

if(Meteor.isServer){

  Villages.before.insert(function(userId, village) {
    village.slug = village.slug.replace(/[-]/g,'');
  });
}
