import { Meteor } from 'meteor/meteor';

import { Notifications } from '../notifications.js';


Meteor.publish('notifications.all', function notificationsAll() {
  return Notifications.find();
});
