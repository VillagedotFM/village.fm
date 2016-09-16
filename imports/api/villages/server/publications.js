import { Meteor } from 'meteor/meteor';

import { Villages } from '../villages.js';


Meteor.publish('villages.all', function villagesAll(request) {

  const selector = {
		'friendlySlugs.slug.base': request.slug
	};

	const options = {
		fields: Villages.publicFields
	}

  return Villages.find(selector, options);
});
