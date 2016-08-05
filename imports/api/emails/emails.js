import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Emails = new Mongo.Collection('emails');

Emails.allow({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

Emails.schema = new SimpleSchema({
  to:
  {
    type: String,
    label: "To"
  },
  value:
  {
    type: Number,
    label: "Value",
  },
  meta:
  {
    type: Object,
    blackbox: true,
    label: "Meta",
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

Emails.attachSchema(Emails.schema);
