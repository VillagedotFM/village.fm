import { Meteor } from 'meteor/meteor';

import { Villages } from './villages.js';


if(Meteor.isServer){

  Villages.before.insert(function(userId, village) {
    //Make the slug lowercase and one word
    const newSlug = village.name.replace(' ', '').toLowerCase();

    village.slug = '/';
    village.friendlySlugs.slug.base = newSlug;
  });

}
