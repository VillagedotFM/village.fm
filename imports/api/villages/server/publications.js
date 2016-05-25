import { Meteor } from 'meteor/meteor';

import { Villages } from '../villages.js';


Meteor.publish('villages.all', function villagesAll() {
  return Villages.find();
});
