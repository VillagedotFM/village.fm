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
    label: "Post",
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
    autoValue: function() {
      if( this.isInsert ) {
        return this.userId;
      }
    }
  }

});

Comments.attachSchema(Comments.schema);
