import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Comments = new Mongo.Collection('comments');

//TODO: Remove Allow's and uncomment Deny's + add methods for post insert
// Comments.deny({
//   insert() { return true; },
//   update() { return true; },
//   remove() { return true; },
// });
Comments.allow({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Comments.publicFields = {
  content: 1,
  postId: 1,
  postArtist: 1,
  postTitle: 1,
  villageName: 1,
  villageSlug: 1,
  replies: 1,
  likes: 1,
  tags: 1,
  createdAt: 1,
  createdBy: 1,
  profile: 1
}

Comments.schema = new SimpleSchema({

  content:
  {
    type: String,
    label: "Content",
    min: 1,
    max: 1000
  },

  postId:
  {
    type: String,
    label: "Post Id",
  },

  postArtist:
  {
    type: String,
    label: "Post Artist",
    optional: true
  },

  postTitle:
  {
    type: String,
    label: "Post Title",
    optional: true
  },

  villageName:
  {
    type: String,
    label: "Village Name",
    max: 50,
    optional: true
  },

  villageSlug:
  {
    type: String,
    label: "Village Slug",
    max: 200,
    optional: true
  },

  replies: {
    type: [Object],
    autoValue: function () {
      if (this.isInsert) {
        return [];
      }
    },
    optional: true
  },

  "replies.$.content": {
    type: String,
    label: "Content",
    min: 1,
    max: 1000
  },
  "replies.$.likes": {
    type: [String],
    autoValue: function() {
      if (this.isInsert) {
        return [this.userId];
      }
    }
  },
  "replies.$.tags": {
    type: [String]
  },
  "replies.$.createdAt": {
    type: Date,
    autoValue: function() {
      if( this.isInsert ) {
          return new Date();
      }
    }
  },
  "replies.$.createdBy": {
    type: String,
    autoValue: function() {
      if( this.isInsert ) {
        return this.userId;
      }
    }
  },

  likes: {
    type: [String],
    autoValue: function() {
      if (this.isInsert) {
        return [this.userId];
      }
    },
    optional: true
  },

  tags: {
    type: [String],
    optional: true
  },

  createdAt: {
    type: Date,
    autoValue: function() {
      if( this.isInsert ) {
          return new Date();
      }
    }
  },

  createdBy: {
    type: String,
    label: "Created by Id",
    autoValue: function() {
      if( this.isInsert ) {
        return this.userId;
      }
    }
  },

  profile: {
    type: Object,
    label: "Profile",
    blackbox: true,
    optional: true
  }

});

Comments.attachSchema(Comments.schema);
