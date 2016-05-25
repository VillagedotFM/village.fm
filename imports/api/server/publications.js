import { Meteor } from 'meteor/meteor';

Meteor.publish('users.allData', function userData() {
  return Meteor.users.find({}, {fields: {'services.facebook.id': 1,
                                        'services.facebook.email': 1,
                                        'services.facebook.first_name': 1,
                                        'profile':1, 'createdAt':1}});
});
