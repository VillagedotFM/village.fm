import { Mongo } from 'meteor/mongo';

export const Notifications = new Mongo.Collection('notifications');

Notifications.allow({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Notifications.schema = new SimpleSchema({

  intendedFor:
  {
    type: String,
    label: "intended for",
    max: 50
  },
  message:
  {
    type: String,
    label: "message",
    max: 200
  },
  userId:
  {
    type: String,
    label: "user",
    max: 50
  },
  villageSlug:
  {
    type: String,
    label: "village",
    max: 50,
    optional: true
  },
  postId:
  {
    type: String,
    label: "post",
    max: 50
  },
  thumbnail:
  {
    type: String,
    label: "Youtube thumbnail",
    max: 400
  },
  type:
  {
    type: String,
    label: "upvote/comment/reply/friend(tag)/award",
    max: 12
  },
  isRead:
  {
    type: Boolean,
    autoValue: function() {
      if( this.isInsert ) {
          return false;
      }
    }
  },
  isSeen:
  {
    type: Boolean,
    autoValue: function() {
      if( this.isInsert ) {
          return false;
      }
    }
  },
  createdAt: {
    type: Date,
    autoValue: function() {
      if( this.isInsert ) {
          return new Date();
      }
    }
  }
});

Notifications.attachSchema(Notifications.schema);
