import { Meteor } from 'meteor/meteor';

import { Posts } from '../posts.js';
import { Villages } from '../../villages/villages.js';


Meteor.publish('posts.all', function postsAll(villageSlug) {
	if(villageSlug){
		const village = Villages.findOne({ slug: villageSlug });
		if(village){
			return Posts.find({ villages: { $in: [village._id] }});
		}
	} else {
		return Posts.find();
	}
  
});

Meteor.publish('posts.single', function postsSingle(_id) {
	check(_id, String);
	return Posts.find({_id});
});
