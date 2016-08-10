import { Meteor } from 'meteor/meteor';

import { Posts } from './posts.js';
import { Inbox } from '../inbox/inbox.js';


if(Meteor.isServer){
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
      Inbox.insert({
        to: tag,
        from: userId,
        postId: post._id
      });
    });
  });

  Posts.after.update(function (userId, post, fieldNames, modifier, options) {
    let newTags = _.difference(post.taggedUsers, this.previous.taggedUsers);

    if (newTags.length === 0) {
      return;
    }

    //Send post to tagged users' Inbox

    _.each(newTags, function(tag) {
      Inbox.insert({
        to: tag,
        from: userId,
        postId: post._id
      });
    });
  });
}
