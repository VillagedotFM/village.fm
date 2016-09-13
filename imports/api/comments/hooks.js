import { Meteor } from 'meteor/meteor';

import { Comments } from './comments.js';
import { Notifications } from '../notifications/notifications.js';
import { Posts } from '../posts/posts.js';
import { Emails } from '../emails/emails.js';

if(Meteor.isServer){

  Comments.before.insert(function(userId, comment){
    var post = Posts.findOne({ _id: comment.postId });
    var user = Meteor.users.findOne({ _id: userId });

    if(post){
      comment.postArtist = ( post.artist ? post.artist : '' );
      comment.postTitle = ( post.title ? post.title : '' );
      comment.villageName = ( post.villageName ? post.villageName : '' );
      comment.villageSlug = ( post.villageSlug ? post.villageSlug : '' );
      comment.createdByName = ( user ? user.profile.name : '' );
      comment.createdByImage = ( user ? user.profile.picture : '' );
    }
  });

  Comments.before.update(function (userId, comment, fieldNames, modifier, options) {
    if(modifier && modifier.$push && modifier.$push.replies){
      var post = Posts.findOne({ _id: comment.postId });
      var user = Meteor.users.findOne({ _id: userId });

      if(post){
        modifier.$push.replies.postArtist = ( post.artist ? post.artist : '' );
        modifier.$push.replies.postTitle = ( post.title ? post.title : '' );
        modifier.$push.replies.villageName = ( post.villageName ? post.villageName : '' );
        modifier.$push.replies.villageSlug = ( post.villageSlug ? post.villageSlug : '' );
        modifier.$push.replies.createdByName = ( user ? user.profile.name : '' );
        modifier.$push.replies.createdByImage = ( user ? user.profile.picture : '' );
      }
    }
  });

  Comments.after.insert(function (userId, comment){
    Posts.update(comment.postId, {
      $addToSet: {
        comments: comment
      }
    })
  });

  Comments.after.update(function (userId, comment, fieldNames, modifier, options) {
    Posts.update({ _id: comment.postId, 'comments._id': comment._id}, {
      $set: {
        'comments.$': comment
      }
    });
  });

  Comments.after.insert(function (userId, comment) {
    var post = Posts.findOne({_id:comment.postId});
    var username = Meteor.users.findOne(userId).profile.name;
    var receiver = Meteor.users.findOne(userId).services.facebook.email;
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

      Emails.insert({
        to: post.createdBy,
        value: 4,
        meta: {
          from: userId,
          postId: post._id,
        }
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

    //Upvotes
    if (_.contains(fieldNames, 'likes') && this.previous.likes.length < comment.likes.length) {
      var username = Meteor.users.findOne(userId).profile.name;

      var content;
      if(comment.content.length < 20)
        content = comment.content;
      else {
        content = comment.content.substr(0,20) + '...'
      }

      var others = comment.likes.length - 1;  //Minus 1 for current upvoter
      if(_.contains(comment.likes, comment.createdBy))
        others = others - 1;                //Subtract another one for own upvotes
      if(comment.createdBy !== userId) {
        var message;
        if (others > 0) {
          message = "Your comment on " + post.artist + "-" + post.title + ", \""+content+"\", was upvoted by " + username + " and " + (others) + " others";
        } else {
          message = "Your comment on " + post.artist + "-" + post.title + ", \""+content+"\", was upvoted by " + username;
        }

        Notifications.insert({
          intendedFor: comment.createdBy,
          message: message,
          userId: userId,
          postId: post._id,
          thumbnail: post.thumbnail,
          type: 'upvote'
        });
      }
    }

  });
}
