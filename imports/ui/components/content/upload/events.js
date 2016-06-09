let resetForm = () => {
  $("input[name=post-link]").val('');
  $('input[name=post-link]').prop('disabled', false);
  $('.postLinkBtn').prop('disabled', true);

  uploadRef.showForm.set(false);
};


Template.upload.events({
  'keyup input[name=post-link]'(event, instance) {
    let potentialLink = $("input[name=post-link]").val();

    Meteor.call('getTypeAndId', potentialLink, function(error, data){
      if (error) {
        console.log(error);
      } else if(data) {
        //Allow link to be submitted
        uploadRef.missingData.set(false);
        $('.postLinkBtn').prop('disabled', false);

        //Add attributes to input
        $("input[name=post-link]").data('type', data.type);
        $("input[name=post-link]").data('vidId', data.vidId);
      } else {
        //Don't allow link to be submitted
        uploadRef.missingData.set(true);
        $('.postLinkBtn').prop('disabled', true);
      }
    });
  },
  "submit .linkUpload"(event, instance) {
    event.preventDefault();

    if (uploadRef.missingData.get()) //Don't allow submit
      return;

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
          //Set auto values in form
          uploadRef.uploadedThumbnail.set(thumbnail);
          uploadRef.uploadedArtist.set(data.artist);
          uploadRef.uploadedTitle.set(data.title);

          uploadRef.showForm.set(true);

          $('input[name=post-author]').focus();
        }
      }
    });
  },
  'keyup input[name=post-author], keyup input[name=post-name]'(event, instance) {
    //Check is artist and title have vaule, if not -> disable submit and display red error
    if($('input[name=post-author]').val() !== '' && $('input[name=post-name]').val() !== '') {
      uploadRef.missingData.set(false);
      $('.postUploadBtn').prop('disabled', false);
      $(event.target).removeClass('formError');
    } else {
      uploadRef.missingData.set(true);
      $('.postUploadBtn').prop('disabled', true);
      $(event.target).addClass('formError');
    }
  },
  "click .uploaded-item__cancel"(event, instance) {
    resetForm();
  },
  //TODO: Tagged users, tags, related, genre (SC only)
  'submit .postUpload'(event, instance) {
    event.preventDefault();

    if (uploadRef.missingData.get()) //Don't allow submit
      return;

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
