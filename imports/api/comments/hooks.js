import { Meteor } from 'meteor/meteor';

import { Comments } from './comments.js';
import { Notifications } from '../notifications/notifications.js';
import { Posts } from '../posts/posts.js';


if(Meteor.isServer){
  Comments.after.insert(function (userId, comment) {
    var post = Posts.findOne({_id:comment.postId});
    var username = Meteor.users.findOne(userId).profile.name;
    var comments = Comments.find({postId: comment.postId}).fetch();
    var commentors = _.uniq(comments, function(comment) { return comment.userId; });
    commentors = _.pluck(commentors, 'userId');

    //Notify poster of comment
    if (userId !== post.createdBy) {      //if not their comment
      var message;
      var others = commentors.length - 1; //Minus 1 for current commentor
      if(_.contains(commentors, post.createdBy))
        others = others - 1;              //Subtract another one for own comments
      if (others === 0) {
        message = "Your post, " + post.artist + "-" + post.title + ", was commented on by " + username;
      } else {
        message = "Your post, " + post.artist + "-" + post.title + ", was commented on by " + username + " and " + others + " others";
      }

      Notifications.insert({
        intendedFor: post.createdBy,
        message: message,
        userId: userId,
        postId: post._id,
        thumbnail: post.thumbnail,
        type: 'comment'
      });
    }

    // //Notifying each commentors
    // var intendedFor = _.reject(commentors, function(commentor) {
    //   return commentor === userId;
    // });
    // if(commentors.length === 1)
    //   return
    // else if(intendedFor.length === 1) {
    //   var message = "The post you commented on, " + post.artist + "-" + post.title + ", was also commented on by " + username;
    //   Notifications.insert({
    //     intendedFor: intendedFor,
    //     message: message,
    //     userId: userId,
    //     postId: post._id,
    //     thumbnail: post.thumbnail,
    //     type: 'comment'
    //   });
    // } else {
    //   _.each(intendedFor, function(commentor) {
    //     var message = "The post you commented on, " + post.artist + "-" + post.title + ", was also commented on by " + username+ " and " + (intendedFor.length-1) + " others";
    //
    //     Notifications.insert({
    //       intendedFor: commentor,
    //       message: message,
    //       userId: userId,
    //       postId: post._id,
    //       thumbnail: post.thumbnail,
    //       type: 'comment'
    //     });
    //   });
    // }
  });

  Comments.after.update(function (userId, comment, fieldNames, modifier, options) {
    // let newTags = _.difference(post.taggedUsers, this.previous.taggedUsers);
    //
    // if (newTags.length === 0) {
    //   return;
    // }

  });
}
