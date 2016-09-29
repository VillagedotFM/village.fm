import { Meteor } from 'meteor/meteor';

import { Profiles } from '../profiles.js';

Meteor.publish('profiles.all', function commentsAll() {
  return [];
});

Meteor.publish('profiles.self', function profilesSelf() {
  return Profiles.find({ createdBy: this.userId });
});
