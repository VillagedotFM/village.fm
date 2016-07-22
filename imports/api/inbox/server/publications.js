import { Meteor } from 'meteor/meteor';

import { Inbox } from '../inbox.js';


Meteor.publish('inbox.all', function inboxAll() {
  return Inbox.find();
});
