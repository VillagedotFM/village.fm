import { Meteor } from 'meteor/meteor';

import { Profiles } from './profiles.js';
import { Villages } from '../villages/villages.js';

Profiles.after.insert(function (userId, profile) {
  let village = Villages.findOne({});

  Villages.update(village._id, {
    $addToSet: {
      profiles: profile
    }
  });
});
