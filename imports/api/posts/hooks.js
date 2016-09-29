import { Meteor } from 'meteor/meteor';

import { Posts } from './posts.js';
import { Inbox } from '../inbox/inbox.js';
import { Emails } from '../emails/emails.js';
import { Villages } from '../villages/villages.js';


if(Meteor.isServer){

  Posts.before.insert(function(userId, post) {
    //Add Village Name & Slug to post to denormalise
    if(post.villages){
      const village = Villages.findOne({ _id: post.villages[0]});

      if(village){
        post.villageName = village.name;
        post.villageSlug = village.friendlySlugs.slug.base;
      }

    }
  });

  Posts.after.insert(function (userId, post) {
    if(post.villages.length){
      Villages.update(post.villages[0], {
        $addToSet: {
          posts: post
        }
      });
    }
  });

  Posts.after.update(function (userId, post, fieldNames, modifier, options) {
    if(post.villages.length){
      Villages.update({ _id: post.villages[0], 'posts._id': post._id }, {
        $set: {
          'posts.$': post
        }
      });
    }
  });

  Posts.after.insert(function (userId, post) {
    //Create YTPlayer
    // createYTPlayer(post, "last");

    //Insert post into taggedUsers inbox
    var tags = post.taggedUsers;
    var tagged = _.uniq(tags, function(tag) { return tag; });

    if (tags.length === 0) {
      return;
    }

    //Send post to tagged users' Inbox
    _.each(tagged, function(tag) {
      insertNewItem_TaggedInPost(tag, userId, post._id);
    });
  });

  Posts.after.update(function (userId, post, fieldNames, modifier, options) {

    //Tagged Users
    let newTags = _.difference(post.taggedUsers, this.previous.taggedUsers);

    if (newTags.length !== 0) {
      //Send post to tagged users' Inbox
      _.each(newTags, function(tag) {
        insertNewItem_TaggedInPost(tag, userId, post._id);
      });
    }
  });
}

function insertNewItem_TaggedInPost(tag, userId, postId) {
  Inbox.insert({
    to: tag,
    from: userId,
    postId: postId
  });

  Emails.insert({
    to: tag,
    value: 5,
    meta: {
      from: userId,
      postId: postId
    }
  });
}
