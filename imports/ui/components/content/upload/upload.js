import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { HTTP } from 'meteor/http';

import './upload.html';

ytApiKey = Meteor.settings.public.youtube.key;

//Adds either "youtube"/ytId, "soundcloud"/scId (eventually), or nothing to the link data
let getTypeAndId = (link) => {

  const ytRegex = /^.*(?:(?:youtu\.be\/|v\/|vi\/|u\/\w\/|embed\/)|(?:(?:watch)?\?v(?:i)?=|\&v(?:i)?=))([^#\&\?]*).*/;
  let ytMatch = link.match(ytRegex);

  if (ytMatch) {  //The user-provide url is a link to a youtube video
    let type = 'youtube';
    let vidId = ytMatch[1]; //[1] is the actual video id

    if (vidId.length == 11) { //Length of ytId
      $('.linkUpload').submit(true);
      $('.postLinkBtn').prop('disabled', false);
      $("input[name=post-link]").data('type', type);
      $("input[name=post-link]").data('vidId', vidId);
      return;
    } else {
      $('.linkUpload').submit(false);
      $('.postLinkBtn').prop('disabled', true);
      return null;
    }
  } else {
    console.log('on to test for soundcloud');
    //TODO: Add a check for soundcloud links
    $('.linkUpload').submit(false);
    $('.postLinkBtn').prop('disabled', true);
    return null;
  }
};

let resetForm = () => {
  $('.uploaded-item').hide();
  $("input[name=post-link]").val('');
  $('input[name=post-link]').prop('disabled', false);
  $('.postLinkBtn').prop('disabled', true);
};


Template.upload.onCreated(function uploadOnCreated() {
  this.notFound = new ReactiveVar(false);
  this.duplicate = new ReactiveVar(null);
  this.postSuccess = new ReactiveVar(null);
});

Template.upload.helpers({
  notFound() {
    return Template.instance().notFound.get();
  },
  duplicate() {
    return Template.instance().duplicate.get();
  },
  postSuccess() {
    return Template.instance().postSuccess.get();
  },
});

Template.upload.events({
  'keyup input[name=post-link]'(event, instance) {
    let potentialLink = $("input[name=post-link]").val();
    getTypeAndId(potentialLink);
  },
  "submit .linkUpload"(event, instance) {
    event.preventDefault();

    $('input[name=post-link]').prop('disabled', true);
    let link = $("input[name=post-link]").val();
    $('.postLinkBtn').prop('disabled', true);

    let vidId = $("input[name=post-link]").data('vidId');

    let thumbnail = "http://img.youtube.com/vi/" + vidId + "/hqdefault.jpg";

    var artist, title;

    //TODO: break out into Meteor method. Performance?
    //Grab entire video title and parse it into Artist and Song Title
    HTTP.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + vidId + "&key=" + ytApiKey, function(error, data) {
      if (error) {
        console.log(error);
      } else {
        if(data.data.items[0]) {
          var ytArtistTitle = data.data.items[0].snippet.title
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

          var ytSplit = ytArtistTitle.split('-');
          var autoArtist, autoTitle;

          if (ytSplit[1]) { //If there is a dash in the title
            if (ytSplit.length > 2) { //If there are multiple dashes, take everything left of 2nd as Artist
              autoArtist = ytSplit[0].trim() + '-' + ytSplit[1].trim();
              autoTitle = (ytSplit[2].trim())
              .replace(/\s*\*+\s?\S+\s?\*+$/, '') // **NEW**
              .replace(/\s*video\s*clip/i, '') // video clip
              .replace(/\s+\(?live\)?$/i, '') // live
              .replace(/\(\s*\)/, '') // Leftovers after e.g. (official video)
              .replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2') // Artist - The new "Track title" featuring someone
              .replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2').trim(); // 'Track title'
            } else {  //If there is one dash, take every left as Artist
              autoArtist = ytSplit[0].trim();
              autoTitle = (ytSplit[1].trim())
              .replace(/\s*\*+\s?\S+\s?\*+$/, '') // **NEW**
              .replace(/\s*video\s*clip/i, '') // video clip
              .replace(/\s+\(?live\)?$/i, '') // live
              .replace(/\(\s*\)/, '') // Leftovers after e.g. (official video)
              .replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2') // Artist - The new "Track title" featuring someone
              .replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2').trim(); // 'Track title'
            }
          } else {  //No dashes, look for quotes
            autoArtist = ytArtistTitle
            .replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$1') // Artist - The new "Track title" featuring someone
            .replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$1').trim(); // 'Track title'
            autoTitle = ytArtistTitle
            .replace(/^(|.*\s)"(.*)"(\s.*|)$/, '$2') // Artist - The new "Track title" featuring someone
            .replace(/^(|.*\s)'(.*)'(\s.*|)$/, '$2').trim(); // 'Track title'
          }

          artist = autoArtist;
          title = autoTitle;

        } else {
          //TODO: Handle reporting link not working
          alert('Song not found');
          instance.notFound.set(true);
          resetForm();
          return;
        }
      }


      //Check for duplicates
      var ids = Posts.find().fetch();
      var duplicate = _.findWhere(ids, {vidId: vidId});
      if(duplicate) {
        //TODO: Handle displaying other post
        alert('Someone already posted that song');
        instance.duplicate.set(duplicate);
        resetForm();
        return;
      } else {
        $('.uploadedThumbnail').prop("src", thumbnail);
        $('input[name=post-author]').val(artist);
        $('input[name=post-name]').val(title);

        $('.uploaded-item').show();
        $('input[name=post-author]').focus();

        if ($('input[name=post-author]').val() !== '' && $('input[name=post-name]').val() !== '') {
          $('.postUploadBtn').prop('disabled', false);
        } else {
          $('.postUploadBtn').prop('disabled', true);
          $('.postUpload').submit(false);
        }
      }
    });
  },
  'keyup input[name=post-author], keyup input[name=post-name]'(event, instance) {
    if($('input[name=post-author]').val() !== '' && $('input[name=post-name]').val() !== '') {
      $('.postUploadBtn').prop('disabled', false);
      $(event.target).removeClass('formError');
    } else {
      $('.postUploadBtn').prop('disabled', true);
      $('.postUpload').submit(false);
      $(event.target).addClass('formError');
    }
  },
  "click .uploaded-item__cancel"(event, instance) {
    resetForm();
  },
  //TODO: Tagged users, tags, related, genre (SC only)
  'submit .postUpload'(event, instance) {
    event.preventDefault();
    let id = $("input[name=post-link]").data('vidId');
    HTTP.get("https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id="+id+"&key="+ytApiKey, function(error, data) {
      if (error) {
        console.log(error);
      } else {
        if(data.data.items[0]) {
          let durationISO = data.data.items[0].contentDetails.duration;
          let durationArray = durationISO.match(/(\d+)(?=[MHS])/ig)||[];
          var durationFormatted = durationArray.map(function(item){
              if(item.length<2) return '0'+item;
              return item;
          }).join(':');
          let duration = durationFormatted[0] == '0' ? durationFormatted.substring(1,5) : durationFormatted;
          let post = {
            villages: ["M2Tgh3JRiu9p8FYb8"], //Hardcoded for testing, should default to main village for v0.2
            link: $("input[name=post-link]").val(),
            vidId: id,
            thumbnail: "http://img.youtube.com/vi/" + id + "/hqdefault.jpg",
            artist: $('input[name=post-author]').val(),
            title: $('input[name=post-name]').val(),
            description: $('input[name=post-caption]').val(),
            duration: duration
          }

          Posts.insert(post, function(error, result){
            if(!error)
              resetForm();
          });
        }
      }
    });
  }
});
