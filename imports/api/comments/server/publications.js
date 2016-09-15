import { Meteor } from 'meteor/meteor';

import { Comments } from '../comments.js';


Meteor.publish('comments.all', function commentsAll(request) {
  const selector = {};

	const options = {
		fields: Comments.publicFields
	}

	return Comments.find(selector, options);
});
