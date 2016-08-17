import { Meteor } from 'meteor/meteor';

import { Posts } from '../posts.js';
import { Villages } from '../../villages/villages.js';


Meteor.publish('posts.all', function postsAll(villageSlug) {
	return Posts.find();
});

Meteor.publish('posts.single', function postsSingle(_id) {
	check(_id, String);
	return Posts.find({_id});
});
