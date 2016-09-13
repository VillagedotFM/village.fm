import { Meteor } from 'meteor/meteor';

import { Comments } from '../comments.js';


Meteor.publish('comments.all', function commentsAll() {
  return [];
});
