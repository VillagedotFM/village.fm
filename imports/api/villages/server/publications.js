import { Meteor } from 'meteor/meteor';

import { Villages } from '../villages.js';


Meteor.publish('villages.all', function villagesAll(request) {

  const selector = {
		slug: request.slug
	};

	const options = {
		fields: Villages.publicFields
	}

  return Villages.find(selector, options);
});
