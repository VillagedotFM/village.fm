import { Meteor } from 'meteor/meteor';

import { Comments } from './comments.js';
import { Notifications } from '../notifications/notifications.js';
import { Posts } from '../posts/posts.js';


if(Meteor.isServer){
  Comments.after.insert(function (userId, comment) {
    var post = Posts.findOne({_id:comment.postId});
    var username = Meteor.users.findOne(userId).profile.name;
    var comments = Comments.find({postId: comment.postId}).fetch();
    var commentors = _.uniq(comments, function(comment) { return comment.createdBy; });
    commentors = _.pluck(commentors, 'createdBy');

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

    //Notifying each commentors
    var intendedFor = _.reject(commentors, function(commentor) {
      return commentor === userId;
    });
    if(commentors.length !== 1) {
      if(intendedFor.length === 1) {
        var message = "The post you commented on, " + post.artist + "-" + post.title + ", was also commented on by " + username;
        Notifications.insert({
          intendedFor: intendedFor[0],
          message: message,
          userId: userId,
          postId: post._id,
          thumbnail: post.thumbnail,
          type: 'comment'
        });
      } else {
        _.each(intendedFor, function(commentor) {
          var message = "The post you commented on, " + post.artist + "-" + post.title + ", was also commented on by " + username+ " and " + (intendedFor.length-1) + " others";

          Notifications.insert({
            intendedFor: commentor,
            message: message,
            userId: userId,
            postId: post._id,
            thumbnail: post.thumbnail,
            type: 'comment'
          });
        });
      }
    }
  });

  Comments.after.update(function (userId, comment, fieldNames, modifier, options) {
    var post = Posts.findOne({_id:comment.postId});

    //Replies
    if (_.contains(fieldNames, 'replies') && this.previous.replies.length < comment.replies.length) {
      var username = Meteor.users.findOne(modifier.$push.replies.createdBy).profile.name;
      var content;
      if(comment.content.length < 20)
        content = comment.content;
      else {
        content = comment.content.substr(0,20) + '...'
      }


      var repliers = _.uniq(comment.replies, function(reply) { return reply.createdBy; });
      repliers = _.pluck(repliers, 'createdBy');
      var others = repliers.length - 1; //Minus 1 for current replier
      if(_.contains(repliers, comment.createdBy))
        others = others - 1;              //Subtract another one for own replies

      if(comment.createdBy !== userId) {
        var message;
        if (others > 1) {
          message = "Your comment on " + post.artist + "-" + post.title + ", \""+content+"\", was replied to by " + username + " and " + (others - 1) + " others";
        } else {
          message = "Your comment on " + post.artist + "-" + post.title + ", \""+content+"\", was replied to by " + username;
        }

        Notifications.insert({
          intendedFor: comment.createdBy,
          message: message,
          userId: userId,
          postId: post._id,
          thumbnail: post.thumbnail,
          type: 'reply'
        });
      }
    }

    // if (_.contains(fieldNames, 'likes') && this.previous.likes.length < comment.likes.length) {
    //   var username = Meteor.users.findOne(userId).profile.name;
    //
    //   var content;
    //   if(comment.content.length < 20)
    //     content = comment.content;
    //   else {
    //     content = comment.content.substr(0,20) + '...'
    //   }
    //
    //   var others = comment.likes.length - 1;  //Minus 1 for current upvoter
    //   if(_.contains(comment.likes, comment.userId))
    //     others = others - 1;                //Subtract another one for own upvotes
    //   if(comment.userId !== userId) {
    //     var message;
    //     if (others > 0) {
    //       message = "Your comment on " + post.artist + "-" + post.title + ", \""+content+"\", was upvoted by " + username + " and " + (others) + " others";
    //     } else {
    //       message = "Your comment on " + post.artist + "-" + post.title + ", \""+content+"\", was upvoted by " + username;
    //     }
    //
    //     Notifications.insert({
    //       intendedFor: comment.userId,
    //       message: message,
    //       userId: userId,
    //       postId: post._id,
    //       thumbnail: post.thumbnail,
    //       type: 'upvote'
    //     });
    //   }
    // }

  });
}
