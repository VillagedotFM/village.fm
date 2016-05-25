import { Meteor } from 'meteor/meteor';

import { Posts } from '../posts.js';


Meteor.publish('posts.all', function postsAll() {
  return Posts.find();
});
