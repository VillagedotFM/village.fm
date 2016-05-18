import { Meteor } from 'meteor/meteor';

import { Posts } from './posts.js';


Meteor.methods({
  upvotePost:function(postId){

    let affected = Posts.update({
        _id: postId,
        upvotedBy: {$ne: this.userId},
    },{
        $addToSet: {
            upvotedBy: this.userId
        },
        $set: {
          lastUpvote: new Date()
        }
    });

   if (! affected) {
     Posts.update(
        postId
      ,{
        $pull: {
            upvotedBy: this.userId
        }
      });
    }
  }
});
