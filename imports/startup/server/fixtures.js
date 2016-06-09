import { Meteor } from 'meteor/meteor';
import { Villages } from '../../api/villages/villages.js';

// if the database is empty on server start, create some sample data.
Meteor.startup(() => {
  if (Villages.find().count() === 0) {
    Villages.insert({
      name: 'Main',
      description: 'The main Village',
    });
  }
});
