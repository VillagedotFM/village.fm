import { Mongo } from 'meteor/mongo';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Profiles } from '../profiles/profiles.js';

export const Posts = new Mongo.Collection('posts');

//TODO: Remove Allow's and uncomment Deny's + add methods for post insert
// Posts.deny({
//   insert() { return true; },
//   update() { return true; },
//   remove() { return true; },
// });

Posts.allow({
  insert() { return true; },
  update() { return true; },
  remove() { return true; },
});


Posts.publicFields = {
  'villages': 1,
  'villageName': 1,
  'villageSlug': 1,
  'link': 1,
  'type': 1,
  'thumbnail': 1,
  'vidId': 1,
  'artist': 1,
  'title': 1,
  'description': 1,
  'duration': 1,
  'taggedUsers': 1,
  'tags': 1,
  'related': 1,
  'genre': 1,
  'creator': 1,
  'upvotes': 1,
  'upvotedBy': 1,
  'upvoteObjects': 1,
  'comments': 1,
  'lastUpvote': 1,
  'listens': 1,
  'listenedBy': 1,
  'createdAt': 1,
  'createdBy': 1,
  'profile': 1,
  'categories': 1
}

Posts.schema = new SimpleSchema({

  villages:
  {
    type: [String],
    label: "Village Ids",
    max: 20                   //Ids of villages the post was posted in
  },

  categories:
  {
    type: [String],
    label: "Categories",
    max: 200                   //Categories the post was posted in
  },

  villageName:
  {
    type: String,
    label: "Primary Village Name",
    max: 50,
    optional: true
  },

  villageSlug:
  {
    type: String,
    label: "Primary Village Slug",
    max: 200,
    optional: true
  },

  link:
  {
    type: String,
    label: "Link",            //User Entered
    max: 500                  //"https://www.youtube.com/watch?v=xUq1rZ7mmns"     "xUq1rZ7mmns"
                              //"http://img.youtube.com/vi/xUq1rZ7mmns/hqdefault.jpg"
  },

  type:
  {
    type: String,
    label: "Post Type",
    max: 20,
    defaultValue: 'youtube'   //or 'soundcloud'
  },

  thumbnail:
  {
    type: String,             //SC artwork_url
    label: "Thumbnail Url",       //"http://img.youtube.com/vi/" + vidId + "/hqdefault.jpg"
    max: 400,
    optional: true
  },

  vidId:                      //v=XXXXXXXXXX
  {                           //SC.resolve(track_url)
    type: String,
    label: "Video Id",
    max: 20
  },

  artist:
  {
    type: String,
    label: "Artist",         //User Entered or Autotitle parser
    max: 100
  },

  title:
  {
    type: String,
    label: "Title",          //User Entered or Autotitle parser
    max: 100
  },

  description:
  {
    type: String,
    label: "Description",    //User Entered
    max: 140,
    optional: true
  },

  duration:
  {
    type: String,
    label: "Duration",        //https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=id&key=key
    max: 10,                  //data.items[0].contentDetails.duration
  },

  taggedUsers:
  {
    type: [String],
    label: "Tagged Users",        //User Entered
    defaultValue: [],
  },

  tags:                     //data.items[0].snippet.tags
  {                         //SC tag_list
    type: [String],
    label: "Tags",
    defaultValue: [],
  },

  related:                 //search?part=snippet&relatedToVideoId=vidId&type=video&key=key //for(data.items).id.videoId
  {                        //SC tracks/ comma separated list of tags
    type: [String],
    label: "Related Songs",
    defaultValue: [],
  },

  genre:                     //SC only (can always fill in manually or scrape youtube)
  {
    type: [String],
    label: "Genre",
    defaultValue: [],
  },

  creator:                     //SC only (can always fill in manually or scrape youtube)
  {
    type: Object,
    label: "creator",
    optional: true
  },

  "creator.username": {
    type: String,
    label: "Username",
  },
  "creator.link": {
    type: String,
    label: "Link",
  },
  "creator.photo": {
    type: String,
    label: "Photo",
  },

  upvotes:
  {
    type: Number,
    label: "Upvotes",
    defaultValue: 1
  },


  upvotedBy:                //# of upvotes = upvotedBy.length
  {
    type: [String],
    label: "Upvoters",
    autoValue: function() {
      if( this.isInsert ) {
        return [this.userId];
      }
    }
  },

  upvoteObjects:
  {
    type: [Object],
    label: "Upvotes",
    blackbox: true,
    autoValue: function(){
      if( this.isInsert ) {
        var profile = Profiles.findOne({ createdBy: this.userId });

        return [{
          createdBy: this.userId,
          profile: profile
        }];
      }
    }
  },


  comments:
  {
    type: [Object],
    label: "Comments",
    optional: true,
    blackbox: true
  },

  lastUpvote:
  {
    type: Date,
    label: "Last Upvote",
    autoValue: function() {
      if( this.isInsert ) {
          return new Date();
      }
    }
  },

  listens:
  {
    type: Number,
    label: "Listens",
    defaultValue: 0
  },

  listenedBy:                 //# of listens = listenedBy.length
  {
    type: [String],
    label: "Listeners",
    autoValue: function() {
      if( this.isInsert ) {
        return [];
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
    autoValue: function(){
      if( this.isInsert ) {
        var profile = Profiles.findOne({ createdBy: this.userId });
        return profile;
      }
    }
  }

});

Posts.attachSchema(Posts.schema);
