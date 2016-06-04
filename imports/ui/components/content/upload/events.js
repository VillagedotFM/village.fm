let resetForm = () => {
  //TODO: use reactive-var instead to hide uploaded-item 1
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
        //Don't allow link to be submitted
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

    //Grab attributes from input data
    let vidId = $("input[name=post-link]").data('vidId');
    let type = $("input[name=post-link]").data('type');

    //Check for duplicates
    var ids = Posts.find().fetch();
    var duplicate = _.findWhere(ids, {vidId: vidId});
    if(duplicate) {
      //TODO: Handle displaying other post (NEED DESIGN)
      alert('Someone already posted that song');
      uploadRef.duplicate.set(duplicate);
      resetForm();
      return;
    }

    let thumbnail = "http://img.youtube.com/vi/" + vidId + "/hqdefault.jpg";

    //Grab formatted auto and title
    Meteor.call('getArtistAndTitle', vidId, type, function(error, data){
      if (error) {
        console.log(error);
      } else if (data) {

        //TODO: Handle reporting link not working (NEED DESIGN)
        if (data === 'Song not found') {
          alert('Couldn\'t find that song, try another link');
          uploadRef.notFound.set(true);
          resetForm();
          return;
        } else {
          //TODO: make reactive-var helpers 2
          //Set auto values in form
          $('.uploadedThumbnail').prop("src", thumbnail);
          $('input[name=post-author]').val(data.artist);
          $('input[name=post-name]').val(data.title);

          //TODO: reactive-var 1
          $('.uploaded-item').show();

          $('input[name=post-author]').focus();

          //Allow submit if artist and title have vaules, else disable submit
          if ($('input[name=post-author]').val() !== '' && $('input[name=post-name]').val() !== '') {
            $('.postUploadBtn').prop('disabled', false);
          } else {
            $('.postUploadBtn').prop('disabled', true);
            $('.postUpload').submit(false);
          }
        }
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
  //TODO: Tagged users, tags, related, genre (SC only) 4
  'submit .postUpload'(event, instance) {
    event.preventDefault();

    //Prepare data for insert
    let vidId = $("input[name=post-link]").data('vidId');
    let type = $("input[name=post-link]").data('type');

    var villageId = Villages.findOne({})._id;

    let post = {
      villages: [villageId],
      link: $("input[name=post-link]").val(),
      vidId: vidId,
      type: type,
      thumbnail: "http://img.youtube.com/vi/" + vidId + "/hqdefault.jpg",
      artist: $('input[name=post-author]').val(),
      title: $('input[name=post-name]').val(),
      description: $('textarea[name=post-caption]').val()
    }


    //Grab duration and insert post
    Meteor.call('insertPostWithDuration', post, function(error, data){
      if (error) {
        console.log(error);
      } else if (data) {

        //TODO: Handle insert error (NEED DESIGN)
        if (data === 'Couldn\'t insert post') {
          alert('Couldn\'t post song, try again later');
          uploadRef.postError.set(true);
          resetForm();
          return;
        } else {
          //TODO: Handle posting success (NEED DESIGN)
          alert('Your post is in the Village!');
          uploadRef.postSuccess.set(data); //_id of newly inserted song
          resetForm();
        }
      }
    });
  }
});
