import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


export const Villages = new Mongo.Collection('villages');


// Villages.deny({
//   insert() { return true; },
//   update() { return true; },
//   remove() { return true; },
// });


Villages.schema = new SimpleSchema({
  name:
  {
    type: String,
    label: "Village Name",     //User Entered
    max: 50
  },

  image:
  {
    type: String,              //User Uploaded
    label: "Image Url",
    max: 400,
    optional: true
  },

  description:
  {
    type: String,
    label: "Description",     //User Entered
    max: 400,
    optional: true
  },

  // posts:                       //Possibly Redundant
  // {
  //   type: [String],
  //   label: "Post Ids",         //Users Uploaded
  //   max: 20,
  //   defaultValue: []
  // },

  admins:
  {                           //Admins or Moderators or whatever
    type: [String],
    label: "Admin Ids",
    max: 20,
    autoValue: function() {
      if( this.isInsert ) {
        return [this.userId];
      }
    }
  },

  users:
  {                           //Members or Followers or whatever
    type: [String],
    label: "User Ids",
    max: 20,
    defaultValue: []
  },

  related:
  {                           //Similar villages based on similar posts
    type: [String],
    label: "Related Villages",
    defaultValue: []
  },

  genres:                     //Pulled from posts
  {
    type: [String],
    label: "Genres",
    defaultValue: []
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
        return "The Village";           //this.userId;
      }
    }
  }
});

Villages.attachSchema(Villages.schema);

Villages.helpers({
  posts() {             //Grab list of posts based on their 'villages' attribute
    return Posts.find({ villages: this._id }, { sort: { createdAt: -1 } });
  },
});
