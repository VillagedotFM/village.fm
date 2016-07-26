import { Meteor } from 'meteor/meteor';

import { Comments } from './comments.js';
import { Notifications } from '../notifications/notifications.js';


if(Meteor.isServer){
  Comments.after.insert(function (userId, comment) {
    //Notify poster of comment
    
  });

  Comments.after.update(function (userId, comment, fieldNames, modifier, options) {
    // let newTags = _.difference(post.taggedUsers, this.previous.taggedUsers);
    //
    // if (newTags.length === 0) {
    //   return;
    // }

  });
}
