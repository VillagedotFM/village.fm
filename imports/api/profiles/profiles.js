import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const Profiles = new Mongo.Collection('profiles');

Profiles.allow({
  insert() { return false; },
  update() { return false; },
  remove() { return false; },
});

Profiles.schema = new SimpleSchema({

  firstName:
  {
    type: String,
    label: "First name"
  },

  lastName:
  {
    type: String,
    label: "Last name"
  },

  niceName:
  {
    type: String,
    label: "Nice name"
  },

  villagerNum:
  {
    type: Number,
    label: "Villager Number"
  },

  picture:
  {
    type: String,
    label: "Picture",
    defaultValue: ""
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
    label: "Created by Id"
  }

});

Profiles.attachSchema(Profiles.schema);
