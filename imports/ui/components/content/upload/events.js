let resetForm = () => {
  //TODO: use reactive-var instead to hide uploaded-item
  $('.uploaded-item').hide();
  $("input[name=post-link]").val('');
  $('input[name=post-link]').prop('disabled', false);
  $('.postLinkBtn').prop('disabled', true);
};


Template.upload.events({
  'keyup input[name=post-link]'(event, instance) {
    let potentialLink = $("input[name=post-link]").val();

    Meteor.call('getTypeAndId', potentialLink, function(error, data){
      if (error) {
        console.log(error);
      } else if(data) {
        //Allow link to be submitted
        $('.linkUpload').submit(true);
        $('.postLinkBtn').prop('disabled', false);

        //Add attributes to input
        $("input[name=post-link]").data('type', data.type);
        $("input[name=post-link]").data('vidId', data.vidId);
      } else {
        $('.linkUpload').submit(false);
        $('.postLinkBtn').prop('disabled', true);
      }
    });
  },
  "submit .linkUpload"(event, instance) {
    event.preventDefault();

    //Don't allow user to change link after submitted
    $('input[name=post-link]').prop('disabled', true);
    let link = $("input[name=post-link]").val();
    $('.postLinkBtn').prop('disabled', true);

    let vidId = $("input[name=post-link]").data('vidId');
    let type = $("input[name=post-link]").data('type');

    let thumbnail = "http://img.youtube.com/vi/" + vidId + "/hqdefault.jpg";

    Meteor.call('getArtistAndTitle', vidId, type, function(error, data){
      if (error) {
        console.log(error);
      } else if (data) {
        console.log(data);

        //Check for duplicates
        // var ids = Posts.find().fetch();
        // var duplicate = _.findWhere(ids, {vidId: vidId});
        // if(duplicate) {
        //   //TODO: Handle displaying other post
        //   alert('Someone already posted that song');
        //   instance.duplicate.set(duplicate);
        //   resetForm();
        //   return;
        // } else {
        //   //Set auto values in form
        //   $('.uploadedThumbnail').prop("src", thumbnail);
        //   $('input[name=post-author]').val(artist);
        //   $('input[name=post-name]').val(title);
        //
        //   //TODO: reactive-var
        //   $('.uploaded-item').show();
        //
        //   $('input[name=post-author]').focus();
        //
        //   //Allow submit if artist and title have vaules, else disable submit
        //   if ($('input[name=post-author]').val() !== '' && $('input[name=post-name]').val() !== '') {
        //     $('.postUploadBtn').prop('disabled', false);
        //   } else {
        //     $('.postUploadBtn').prop('disabled', true);
        //     $('.postUpload').submit(false);
        //   }
        // }
      }
    });
  },
  'keyup input[name=post-author], keyup input[name=post-name]'(event, instance) {
    //Check is artist and title have vaule, if not -> disable submit and display red error
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
    console.log(id);

    //Grab duration, insert post
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
            description: $('textarea[name=post-caption]').val(),
            duration: duration
          }

          //TODO: make method
          Posts.insert(post, function(error, result){
            if(error)
              console.log(error);
            else {
              resetForm();
            }
          });
        }
      }
    });
  }
});
