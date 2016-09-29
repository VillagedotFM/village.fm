import { Meteor } from 'meteor/meteor';

import { Posts } from '../posts.js';
import { Villages } from '../../villages/villages.js';

Meteor.publish('posts.all', function postsAll(request) {

	const selector = {};

	if(request.villageSlug && request.villageSlug != 'main'){
		selector.villageSlug = request.villageSlug;
	}

	const options = {
		fields: Posts.publicFields
	}

	return Posts.find(selector, options);
});

Meteor.publish('posts.single', function postsSingle(_id) {
	check(_id, String);

	const selector = {
		_id: _id
	}

	const options = {
		fields: Posts.publicFields
	}

	return Posts.find(selector, options);
});
