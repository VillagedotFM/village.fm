let mobileResetForm = () => {
  $("#mobile-link").val('');
  $("#mobile-artist").val('');
  $("#mobile-title").val('');
  $("#mobile-description").val('');
  mobileUploadRef.uploadedThumbnail.set(false);
  Tags.set('taggedUsers', []);

  $('.us-mobile').hide();
  $('.container').hide();
  $('.sidebar').show();
};

Template.mobile_content.events({
  'keyup #mobile-link'(event, instance) {
    let potentialLink = $("#mobile-link").val();
    console.log(potentialLink);

    Meteor.call('getTypeAndId', potentialLink, function(error, data){
      if (error) {
        console.log(error);
      } else if(data === 'soundcloud') {
        //Soundcloud can only be used on client so grab the id here
        SC.resolve(potentialLink).then(function(track){
          //Allow link to be submitted
          mobileUploadRef.missingData.set(false);

          //Add attributes to input
          $("#mobile-link").data('type', data);
          $("#mobile-link").data('vidId', track.id);

          let vidId = track.id;
          let type = data;

          //Check for duplicates
          var posts = Posts.find().fetch();
          var duplicate = _.find(posts, function(post) {
            return post.vidId == vidId;
          });
          if(duplicate) {
            //TODO: Handle displaying other post (NEED DESIGN)
            alert('Someone already posted that song');
            mobileUploadRef.duplicate.set(duplicate);
            mobileResetForm();
            return;
          }

          var thumbnail;
          var title = '';

          SC.resolve(link).then(function(track) {
            //Handle not streamable (NEED DESIGN)
            thumbnail = track.artwork_url;
            title = track.title;
            console.log(track);

            //Grab formatted auto and title
            //Only pass in title if Soundcloud
            Meteor.call('getArtistAndTitle', vidId, title, function(error, data){
              if (error) {
                console.log(error);
              } else if (data) {
                //Set auto values in form
                mobileUploadRef.uploadedThumbnail.set(thumbnail);
                mobileUploadRef.uploadedArtist.set(data.artist);
                mobileUploadRef.uploadedTitle.set(data.title);

                mobileUploadRef.showForm.set(true);

                $('#mobile-artist').focus();
              }
            });
          });
        });
      }else if (data) {
        //Allow link to be submitted
        mobileUploadRef.missingData.set(false);

        //Add attributes to input
        $("#mobile-link").data('type', data.type);
        $("#mobile-link").data('vidId', data.vidId);

        let vidId = data.vidId;
        let type = data.type;

        //Check for duplicates
        var posts = Posts.find().fetch();
        var duplicate = _.find(posts, function(post) {
          return post.vidId == vidId;
        });
        if(duplicate) {
          //TODO: Handle displaying other post (NEED DESIGN)
          alert('Someone already posted that song');
          mobileUploadRef.duplicate.set(duplicate);
          mobileResetForm();
          return;
        }

        var thumbnail;
        var title = '';

        thumbnail = "https://img.youtube.com/vi/" + vidId + "/hqdefault.jpg";

        //Grab formatted auto and title
        //Only pass in title if Soundcloud
        Meteor.call('getArtistAndTitle', vidId, title, function(error, data){
          if (error) {
            console.log(error);
          } else if (data) {

            //TODO: Handle reporting link not working (NEED DESIGN)
            if (data === 'Song not found') {
              alert('Couldn\'t find that song, try another link');
              mobileUploadRef.notFound.set(true);
              mobileResetForm();
              return;
            } else {
              //Set auto values in form
              mobileUploadRef.uploadedThumbnail.set(thumbnail);
              mobileUploadRef.uploadedArtist.set(data.artist);
              mobileUploadRef.uploadedTitle.set(data.title);

              mobileUploadRef.showForm.set(true);

              $('#mobile-artist').focus();
            }
          }
        });
      } else {
        //Don't allow link to be submitted
        mobileUploadRef.missingData.set(true);
        $('#mobile-post-btn').prop('disabled', true);
      }
    });
  },
  'keyup #mobile-artist, keyup #mobile-title'(event, instance) {
    //Check is artist and title have vaule, if not -> disable submit and display red error
    if($('#mobile-artist').val() !== '' && $('#mobile-title').val() !== '') {
      mobileUploadRef.missingData.set(false);
      $('#mobile-post-btn').prop('disabled', false);
      $(event.target).removeClass('formError');
    } else {
      mobileUploadRef.missingData.set(true);
      $('#mobile-post-btn').prop('disabled', true);
      $(event.target).addClass('formError');
    }
  },
  "click .uploaded-item-mobile__cancel"(event, instance) {
    event.preventDefault();
    mobileResetForm();
  },
  //TODO: Tagged users, tags, related, genre (SC only)
  'click #mobile-post-btn'(event, instance) {
    event.preventDefault();

    if (mobileUploadRef.missingData.get()) //Don't allow submit
      return;

    //Prepare data for insert
    let vidId = $("#mobile-link").data('vidId');
    let type = $("#mobile-link").data('type');
    let link = $("#mobile-link").val();

    var villageId = Villages.findOne({})._id;

    let post = {
      villages: [villageId],
      link: link,
      vidId: vidId,
      type: type,
      thumbnail: $('.mobile-uploaded-thumbnail').prop("src"),
      artist: $('#mobile-artist').val(),
      title: $('#mobile-title').val(),
      description: $('#mobile-description').val(),
      taggedUsers: Tags.get('taggedUsers')
    }

    if (type === 'youtube') {
      //Grab duration and insert post
      Meteor.call('insertPostWithDuration', post, function(error, data){
        if (error) {
          console.log(error);
        } else if (data) {

          //TODO: Handle insert error (NEED DESIGN)
          if (data === 'Couldn\'t insert post') {
            alert('Couldn\'t post song, try again later');
            mobileUploadRef.postError.set(true);
            mobileResetForm();
            return;
          } else {
            //TODO: Handle posting success (NEED DESIGN)
            alert('Your post is in the Village!');
            mobileUploadRef.postSuccess.set(data); //_id of newly inserted song
            mobileResetForm();
          }
        }
      });
    } else {
      SC.resolve(link).then(function(track) {
        post.duration = track.duration;

        //Grab duration and insert post
        Meteor.call('insertPostWithDuration', post, function(error, data){
          if (error) {
            console.log(error);
          } else if (data) {
            //TODO: Handle posting success (NEED DESIGN)
            alert('Your post is in the Village!');
            mobileUploadRef.postSuccess.set(data); //_id of newly inserted song
            mobileResetForm();
          }
        });
      });
    }
  }
});
