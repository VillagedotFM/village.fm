import { Meteor } from 'meteor/meteor';

import { Emails } from '../emails.js';

Meteor.publish('emails.all', function emailsAll() {
  return Emails.find();
});
