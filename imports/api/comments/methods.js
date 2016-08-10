import { Meteor } from 'meteor/meteor';

import { Comments } from './comments.js';

Meteor.methods({
  upvoteComment:function(commentId){

    let affected = Comments.update({
        _id: commentId,
        likes: {$ne: this.userId},
    },{
        $addToSet: {
            likes: this.userId
        }
    });

   if (! affected) {
     Comments.update(
        commentId
      ,{
        $pull: {
            likes: this.userId
        }
      });
    }
  },
  upvoteReply:function(parent, index){

    var affectedReplies = Comments.findOne(parent).replies;

    if (_.contains(affectedReplies[index].likes, this.userId)) {
      affectedReplies[index].likes = _.without(affectedReplies[index].likes, this.userId);
    } else {
      affectedReplies[index].likes.push(this.userId);
    }

    Comments.update({
        _id: parent,
    },{
        $set: {
            replies: affectedReplies
        }
    });
  }
});
