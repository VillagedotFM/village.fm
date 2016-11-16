import {Meteor} from "meteor/meteor";

import { Profiles } from "../../api/profiles/profiles.js";
import { Comments } from "../../api/comments/comments.js";
import { Posts } from "../../api/posts/posts.js";
import { Villages } from "../../api/villages/villages.js";

Meteor.startup(function() {
  Migrations.migrateTo('latest');
});

Migrations.add({
  version: 8,
  name: 'Add data to posts',
  up: function() {
    Posts.find().forEach(function(post){
      // const comments = Comments.find({ postId: post._id }).fetch();
      // const profile = Profiles.findOne({ createdBy: post.createdBy });

      let upvoteObjects = [];
      upvoteProfiles = Profiles.find({ createdBy: { $in: post.upvotedBy } });

      post.upvotedBy.forEach(function(upvote, index){
        upvoteObjects.push({
          createdBy: upvote,
          profile: Profiles.findOne({ createdBy:  upvote  })
        })
      });

      Posts.direct.update(post._id, {
        $set: {
          upvoteObjects: upvoteObjects
          // comments: comments,
          // profile: profile
        }
      });
    });
  },
  down: function() {
    Posts.find().forEach(function(post){
      Posts.update(post._id, {
        $unset: {
          upvoteObjects: 1,
          comments: 1,
          profile: 1
        }
      });
    });
  }
});
