import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Inbox = new Mongo.Collection('inbox');

//TODO: Remove Allow's and uncomment Deny's + add methods for post insert
// Comments.deny({
//   insert() { return true; },
//   update() { return true; },
//   remove() { return true; },
// });
Inbox.allow({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});


Inbox.schema = new SimpleSchema({

  to:
  {
    type: String,
    label: "To"
  },
  from:
  {
    type: String,
    label: "From"
  },
  postId:
  {
    type: String,
    label: "Post",
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

Inbox.attachSchema(Inbox.schema);
