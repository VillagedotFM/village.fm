import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import  moment  from 'moment';

import { Posts } from './posts.js';

//TODO: this stops video
Meteor.methods({
  upvotePost:function(postId){

    let affected = Posts.update({
        _id: postId,
        upvotedBy: {$ne: this.userId},
    },{
        $addToSet: {
            upvotedBy: this.userId
        },
        $set: {
          lastUpvote: new Date()
        }
    });

   if (! affected) {
     Posts.update(
        postId
      ,{
        $pull: {
            upvotedBy: this.userId
        }
      });
    }
  },
  getTypeAndId:function(link){
    const ytRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
    let ytMatch = link.match(ytRegex);

    if (ytMatch) {  //The user-provide url is a link to a youtube video
      let type = 'youtube';
      let vidId = ytMatch[1]; //[1] is the actual video id
      if (vidId.length == 11) { //Length of ytId
        return {
          type: type,
          vidId: vidId
        };
      } else {
        return null;
      }
    } else { //Not Youtube link
      //Check if Soundcloud link
      const scRegex = /^https?:\/\/(soundcloud.com|snd.sc)\/(.*)$/;
      let scMatch = link.match(scRegex);

      if (scMatch) {
        let type = 'soundcloud';
        return type;
      } else {
        return null;
      }
    }
  },
  getArtistAndTitle:function(vidId, title){

    //Grab entire video title and parse it into Artist and Song Title
    if (title === '') { //Youtube video
      let result = HTTP.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + vidId + "&key=" + Meteor.settings.public.youtube.key);

      if(result.data.items[0]) {  //Grab entire title Artist - Title and remove extra shit
        title = result.data.items[0].snippet.title;
      } else {
        return 'Song not found';
      }

    }

    var artistAndTitle = title
    .replace(/\s*\[[^\]]+\]$/, '') // [whatever] at the end
    .replace(/^\s*\[[^\]]+\]\s*/, '') // [whatever] at the start
    .replace(/\s*\[\s*(M\/?V)\s*\]/, '') // [MV] or [M/V]
    .replace(/\s*\(\s*(M\/?V)\s*\)/, '') // (MV) or (M/V)
    .replace(/[\s\-–_]+(M\/?V)\s*/, '') // MV or M/V at the end
    .replace(/(M\/?V)[\s\-–_]+/, '') // MV or M/V at the start
    .replace(/\s*\([^\)]*\bver(\.|sion)?\s*\)$/i, '') // (whatever version)
    .replace(/\s*[a-z]*\s*\bver(\.|sion)?$/i, '') // ver. and 1 word before (no parens)
    .replace(/\s*(of+icial\s*)?(music\s*)?video/i, '') // (official)? (music)? video
    .replace(/\s*(ALBUM TRACK\s*)?(album track\s*)/i, '') // (ALBUM TRACK)
    .replace(/\s*\(\s*of+icial\s*\)/i, '') // (official)
    .replace(/\s*\(\s*explicit\s*\)/i, '') // (explicit)
    .replace(/\s*\(\s*[0-9]{4}\s*\)/i, '') // (1999)
    .replace(/\s+\(\s*(HD|HQ)\s*\)$/, '') // HD (HQ)
    .replace(/[\s\-–_]+(HD|HQ)\s*$/, ''); // HD (HQ)

    var split = artistAndTitle.split('-');
    var autoArtist, autoTitle;

    if (split[1]) { //If there is a dash in the title
      if (split.length > 2) { //If there are multiple dashes, take everything left of 2nd as Artist
        autoArtist = split[0].trim() + '-' + split[1].trim();
        autoTitle = (split[2].trim())
        .replace(/\s*\*+\s?\S+\s?\*+$/, '') // **NEW**
        .replace(/\s*video\s*clip/i, '') // video clip
        .replace(/\s+\(?live\)?$/i, '') // live
        .replace(/\(\s*\)/, '') // Leftovers after e.g. (official video)
        .replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2') // Artist - The new "Track title" featuring someone
        .replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2').trim(); // 'Track title'
      } else {  //If there is one dash, take every left as Artist
        autoArtist = split[0].trim();
        autoTitle = (split[1].trim())
        .replace(/\s*\*+\s?\S+\s?\*+$/, '') // **NEW**
        .replace(/\s*video\s*clip/i, '') // video clip
        .replace(/\s+\(?live\)?$/i, '') // live
        .replace(/\(\s*\)/, '') // Leftovers after e.g. (official video)
        .replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2') // Artist - The new "Track title" featuring someone
        .replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2').trim(); // 'Track title'
      }
    } else {  //No dashes, look for quotes
      autoArtist = artistAndTitle
      .replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$1') // Artist - The new "Track title" featuring someone
      .replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$1').trim(); // 'Track title'
      autoTitle = artistAndTitle
      .replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2') // Artist - The new "Track title" featuring someone
      .replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2').trim(); // 'Track title'
    }

    return {
      artist : autoArtist,
      title : autoTitle
    };

  },
  insertPostWithDuration:function(post){
    //Grab duration, insert post
    if (post.type === 'youtube') {
      let result = HTTP.get("https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id="+ post.vidId +"&key="+ Meteor.settings.public.youtube.key);
      if(result.data.items[0]) {
        //Take ISO duration and format to X:XX
        let durationISO = result.data.items[0].contentDetails.duration;
        let durationArray = durationISO.match(/(\d+)(?=[MHS])/ig)||[];
        var durationFormatted = durationArray.map(function(item){
            if(item.length<2) return '0'+item;
            return item;
        }).join(':');
        let duration = durationFormatted[0] == '0' ? durationFormatted.substring(1,5) : durationFormatted;

        post.duration = duration;


      } else {
        return 'Couldn\'t insert post';
      }
    } else if (post.type === 'soundcloud') {
      let tempDuration = moment.duration(post.duration);  //Convert milliseconds to X:XX
      post.duration = tempDuration.minutes() + ":" + tempDuration.seconds();
    }
    return Posts.insert(post);
  }
});
