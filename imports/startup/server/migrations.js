import {Meteor} from "meteor/meteor";

import { Profiles } from "../../api/profiles/profiles.js";
import { Comments } from "../../api/comments/comments.js";
import { Posts } from "../../api/posts/posts.js";
import { Villages } from "../../api/villages/villages.js";

Meteor.startup(function() {
  Migrations.migrateTo('latest,rerun');
});

Migrations.add({
  version: 6,
  name: 'Add profiles again',
  up: function() {
    Meteor.users.find().forEach(function(user){
      const profile = Profiles.findOne({ createdBy: user._id });

      if(!profile){

        if(!user.services || !user.services.facebook){
          Profiles.direct.insert({
            firstName: user.profile.name,
            lastName: user.profile.name,
            niceName: user.profile.name,
            villagerNum: user.profile.villagerNum,
            picture: user.profile.picture,
            createdBy: user._id
          });
        } else {
          Profiles.direct.insert({
            firstName: user.services.facebook.first_name,
            lastName: user.services.facebook.last_name,
            niceName: user.services.facebook.first_name + " " + user.services.facebook.last_name.charAt(0),
            villagerNum: user.profile.villagerNum,
            picture: "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large",
            createdBy: user._id
          });
        }

      }
    });
  },
  down: function() {
    Profiles.remove({});
  }
});

Migrations.add({
  version: 5,
  name: 'Add gender and age range profiles',
  up: function() {
    Meteor.users.find().forEach(function(user){
      const profile = Profiles.findOne({ createdBy: user._id });
      if(profile){
        Profiles.update(profile._id, {
          $set: {
            gender: user.services.facebook.gender,
            ageRange: user.services.facebook.age_range
          }
        });
      }
    });
  },
  down: function() {
    Profiles.remove({});
  }
});

Migrations.add({
  version: 4,
  name: 'Add data to villages',
  up: function() {
    Villages.find().forEach(function(village){
      const posts = Posts.find({ villages: village._id }).fetch();
      const profiles = Profiles.find({ createdBy: { $in: village.users } }).fetch();

      Villages.direct.update(village._id, {
        $set: {
          posts: posts,
          profiles: profiles
        }
      })
    });
  },
  down: function() {
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


Migrations.add({
  version: 3,
  name: 'Add data to posts',
  up: function() {
    Posts.find().forEach(function(post){
      const comments = Comments.find({ postId: post._id }).fetch();
      const profile = Profiles.findOne({ createdBy: post.createdBy });

      let upvoteObjects = [];
      upvoteProfiles = Profiles.find({ createdBy: { $in: post.upvotedBy } });

      post.upvotedBy.forEach(function(upvote, index){
        upvoteObjects.push({
          createdBy: upvote,
          profile: upvoteProfiles[index]
        })
      });

      Posts.direct.update(post._id, {
        $set: {
          upvoteObjects: upvoteObjects,
          comments: comments,
          profile: profile
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

Migrations.add({
  version: 2,
  name: 'Add data to comments',
  up: function() {

    Comments.find().forEach(function(comment){
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
    });
  },
  down: function() {
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
  }
});


Migrations.add({
  version: 1,
  name: 'Add profiles',
  up: function() {
    Meteor.users.find().forEach(function(user){
      Profiles.direct.insert({
        firstName: user.services.facebook.first_name,
        lastName: user.services.facebook.last_name,
        niceName: user.services.facebook.first_name + " " + user.services.facebook.last_name.charAt(0),
        villagerNum: user.profile.villagerNum,
        picture: "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large",
        createdBy: user._id
      });
    });
  },
  down: function() {
    Profiles.remove({});
  }
});
