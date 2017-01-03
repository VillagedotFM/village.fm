import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';


export const Villages = new Mongo.Collection('villages');

//TODO: Remove Allow's and uncomment Deny's + add methods for village insert (for v0.3?)
// Villages.deny({
//   insert() { return true; },
//   update() { return true; },
//   remove() { return true; },
// });
Villages.allow({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});

// Add slugs to new Villages
Villages.friendlySlugs(
  {
    updateSlug: false,
    createOnUpdate: false
  });

Villages.publicFields = {
  'name': 1,
  'slug': 1,
  'image': 1,
  'description': 1,
  'posts': 1,
  'admins': 1,
  'users': 1,
  //'profiles': 1,
  'related': 1,
  'genres': 1,
  'createdAt': 1,
  'createdBy': 1,
  'website': 1,
  'twitter': 1,
  'facebook': 1,
  'youtube': 1,
  'categories': 1,
  'friendlySlugs': 1
}


Villages.schema = new SimpleSchema({
  name:
  {
    type: String,
    label: "Village Name",     //User Entered
    max: 50
  },

  slug:
  {
    type: String,
    label: "Slug",
    max: 200,
    autoValue: function() {
      return '/';
    }
  },

  image:
  {
    type: Boolean,              //User Uploaded
    label: "Topbar Image exists",
    autoValue: function() {
      if( this.isInsert ) {
        return false;
      }
    }
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

  posts:
  {
    type: [Object],
    label: "Posts",
    blackbox: true,
    defaultValue: []
  },

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

  profiles:
  {
    type: [Object],
    label: "Profiles",
    blackbox: true,
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

  facebook:
  {
    type: String,
    label: "Facebook Link",     //User Entered
    max: 500,
    optional: true
  },
  website:
  {
    type: String,
    label: "Website Link",     //User Entered
    max: 500,
    optional: true
  },
  twitter:
  {
    type: String,
    label: "Twitter Link",     //User Entered
    max: 500,
    optional: true
  },
  youtube:
  {
    type: String,
    label: "Youtube Link",     //User Entered
    max: 500,
    optional: true
  },

  categories: {
    type: [Object],
    autoValue: function () {
      if (this.isInsert) {
        return [
          {name: "Most Upvoted", posts: []},
          {name: "New", posts: []}
        ];
      }
    }
  },

  "categories.$.name": {
    type: String,
    label: "Name",
    min: 1,
    max: 1000
  },
  "categories.$.posts": {
    type: [Object],
    label: "Posts",
    blackbox: true,
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
        return this.userId;
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
