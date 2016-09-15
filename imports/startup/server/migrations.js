import {Meteor} from "meteor/meteor";

import { Profiles } from "../../api/profiles/profiles.js";
import { Comments } from "../../api/comments/comments.js";
import { Posts } from "../../api/posts/posts.js";
import { Villages } from "../../api/villages/villages.js";

Meteor.startup(function() {
  Migrations.migrateTo('latest');
});

Migrations.add({
  version: 1,
  name: 'Add denormalised data',
  up: function() {
    const users = Meteor.users.find();
    for(let i = 0; i < users.length; i++){
      let user = users[0];

      Profiles.direct.insert({
        firstName: user.services.facebook.first_name,
        lastName: user.services.facebook.last_name,
        niceName: user.services.facebook.first_name + " " + user.services.facebook.last_name.charAt(0),
        villagerNum: user.profile.villagerNum,
        picture: "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large",
        createdBy: user._id
      });
    };

    const comments = Comments.find();
    for(let i = 0; i < comments.length; i++){
      let comment = comments[i];
      const post = Posts.findOne({ _id: comment.postId });
      const profile = Profiles.findOne({ createdBy: comment.createdBy });

      Comments.direct.update(comment._id, {
        $set: {
          postArtist: post.artist,
          postTitle: post.title,
          villageName: post.villageName,
          villageSlug: post.villageSlug,
          profile: profile
        }
      });
    };

    const posts = Posts.find();
    for(let i = 0; i < posts.length; i++){
      let post = posts[i];
      const comments = Comments.find({ postId: post._id });
      const profile = Profiles.findOne({ createdBy: post.createdBy });

      let upvoteObjects = [];

      post.upvotedBy.forEach(function(upvote){
        upvoteProfile = Profiles.findOne({ createdBy: upvote });
        upvoteObjects.push({
          createdBy: upvote,
          profile: upvoteProfile
        })
      });

      Posts.direct.update(post._id, {
        $set: {
          upvoteObjects: upvoteObjects,
          comments: comments,
          profile: profile
        }
      });
    };

    const villages = Villages.find();
    for(let i = 0; i < villages.length; i++){
      let village = villages[0];
      const posts = Posts.find({ villages: village._id });
      const profiles = Profiles.find({ createdBy: { $in: village.users } });

      Villages.direct.update(village._id, {
        $set: {
          posts: posts,
          profiles: profiles
        }
      })
    };


  },
  down: function() {
    Profiles.remove({});

    Comments.find().forEach(function(comment){
      Comments.update(comment._id, {
        $unset: {
          postArtist: 1,
          postTitle: 1,
          villageName: 1,
          villageSlug: 1,
          profile: 1
        }
      });
    });

    Posts.find().forEach(function(post){
      Posts.update(post._id, {
        $unset: {
          upvoteObjects: 1,
          comments: 1,
          profile: 1
        }
      });
    });

    Villages.find().forEach(function(village){
      Villages.update(village._id, {
        $unset: {
          posts: 1,
          profiles: 1
        }
      })
    });
  }
});
