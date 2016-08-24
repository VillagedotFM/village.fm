import {Roles} from "meteor/alanning:roles";

let resetForm = () => {
    $("input[name=post-link]").val('');
    $('input[name=post-link]').prop('disabled', false);
    $('.postLinkBtn').prop('disabled', true);
    Tags.set('taggedUsers', []);

    uploadRef.showForm.set(false);
};

//TODO: make attributes (link, type, vidId) reactive vars instead of data on the DOM
//and make sure to clear them on insert!

//TODO: scope jquery elements to template

Template.upload.events({
    'click .after-onboarding__overlay': function(event, template) {
        $('.upload-section__upload').removeClass('after-onboarding');
        $('.after-onboarding__overlay').hide();
    },
    'keyup input[name=post-link]'(event, instance) {
      $('.upload-section__upload').removeClass('after-onboarding');
      $('.after-onboarding__overlay').hide();
      uploadRef.duplicate.set(false);
      uploadRef.notFound.set(false);
        let potentialLink = $("input[name=post-link]").val();

        Meteor.call('getTypeAndId', potentialLink, function (error, data) {
            if (error) {
                console.log(error);
                mixpanel.track('Link error received', {
                  linkErrorType: error.reason,
                  type: 'Unknown'
                });

            } else if (data) {
              mixpanel.track('Song link entered', {
                type: data.type,
                vidId: data.vidId
              });

              if (data === 'soundcloud') {
                //Soundcloud can only be used on client so grab the id here
                SC.resolve(potentialLink).then(function (track) {
                  //Allow link to be submitted
                  uploadRef.missingData.set(false);
                  $('.postLinkBtn').prop('disabled', false);

                  //Add attributes to input
                  $("input[name=post-link]").data('type', data);
                  $("input[name=post-link]").data('vidId', track.id);
                });
              } else {
                //Allow link to be submitted
                uploadRef.missingData.set(false);
                $('.postLinkBtn').prop('disabled', false);

                //Add attributes to input
                $("input[name=post-link]").data('type', data.type);
                $("input[name=post-link]").data('vidId', data.vidId);
              }

              //Grab attributes from input data
              let vidId = $("input[name=post-link]").data('vidId');
              let type = $("input[name=post-link]").data('type');
              let link = $("input[name=post-link]").val();

              //Check for duplicates
              var posts = Posts.find().fetch();
              var duplicate = _.find(posts, function (post) {
                  return post.vidId == vidId;
              });
              if (duplicate) {
                  //TODO: Handle displaying other post (NEED DESIGN)
                  resetForm();

                  mixpanel.track('Link error received', {
                    linkErrorType: 'Already Posted',
                    type: data.type
                  });

                  uploadRef.duplicate.set(duplicate);
                  return;
              }

              var thumbnail;
              var title = '';
              if (type === 'youtube') {
                  thumbnail = "https://img.youtube.com/vi/" + vidId + "/hqdefault.jpg";

                  //Grab formatted auto and title
                  //Only pass in title if Soundcloud
                  Meteor.call('getArtistAndTitle', vidId, title, function (error, data) {
                      if (error) {
                          console.log(error);
                      } else if (data) {

                          //TODO: Handle reporting link not working (NEED DESIGN)
                          if (data === 'Song not found') {
                            console.log('not found');
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

                              if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
                                  Meteor.setTimeout(function () {
                                      $("#fakeUsersPost").select2({
                                          placeholder: "Select a fake user",
                                          allowClear: true
                                      });
                                  }, 300);
                              }
                          }
                      }
                  });
              } else {
                  SC.resolve(link).then(function (track) {
                      //Handle not streamable (NEED DESIGN)
                      scUser = track.user.username;
                      thumbnail = track.artwork_url;
                      title = track.title;
                      console.log(track);

                      //Grab formatted auto and title
                      //Only pass in title if Soundcloud
                      Meteor.call('getArtistAndTitle', vidId, title, function (error, data) {
                          if (error) {
                              console.log(error);
                          } else if (data) {
                              //Set auto values in form
                              uploadRef.uploadedThumbnail.set(thumbnail);
                              if (data.artist !== '') {
                                uploadRef.uploadedArtist.set(data.artist);
                              } else {
                                uploadRef.uploadedArtist.set(scUser);
                              }
                              uploadRef.uploadedTitle.set(data.title);

                              uploadRef.showForm.set(true);

                              $('input[name=post-author]').focus();

                              if (Roles.userIsInRole(Meteor.userId(), ['admin'])) {
                                  Meteor.setTimeout(function () {
                                      $("#fakeUsersPost").select2({
                                          placeholder: "Select a fake user",
                                          allowClear: true
                                      });
                                  }, 300);
                              }
                          }
                      });
                  });
              }
            } else {

                mixpanel.track('Link error received', {
                  linkErrorType: 'Format',
                  type: 'Unknown'
                });

                //Don't allow link to be submitted
                uploadRef.missingData.set(true);
                $('.postLinkBtn').prop('disabled', true);
            }
        });
    },
    'keyup input[name=post-author], keyup input[name=post-name]'(event, instance) {
        //Check is artist and title have vaule, if not -> disable submit and display red error
        if ($('input[name=post-author]').val() !== '' && $('input[name=post-name]').val() !== '') {
            uploadRef.missingData.set(false);
            $('.postUploadBtn').prop('disabled', false);
            $(event.target).removeClass('formError');
        } else {
            uploadRef.missingData.set(true);
            $('.postUploadBtn').prop('disabled', true);
            $(event.target).addClass('formError');
        }
    },
    'keyup textarea[name=post-caption]'(event, instance) {
      if($('textarea[name=post-caption]').val().length < 141)
        uploadRef.chars.set($('textarea[name=post-caption]').val().length);

      if ($('textarea[name=post-caption]').val().length === 140)
        $('.uploaded-item__max-chars.color-secondary-text').css('color','red');
      else
        $('.uploaded-item__max-chars.color-secondary-text').css('color','#c4cacf');
    },
    "click .uploaded-item__cancel"(event, instance) {
        resetForm();
    },
    //TODO: Tagged users, tags, related, genre (SC only)
    'submit .postUpload'(event, instance) {
        event.preventDefault();

        if ($.trim($('input[name=post-author]').val()).length < 1) {
          uploadRef.missingData.set(true);
          $('.postUploadBtn').prop('disabled', true);
          $('input[name=post-author]').addClass('formError');
        }
        if ($.trim($('input[name=post-name]').val()).length < 1) {
          uploadRef.missingData.set(true);
          $('.postUploadBtn').prop('disabled', true);
          $('input[name=post-name]').addClass('formError');
        }

        if (uploadRef.missingData.get()) //Don't allow submit
            return;

        //Prepare data for insert
        let vidId = $("input[name=post-link]").data('vidId');
        let type = $("input[name=post-link]").data('type');
        let link = $("input[name=post-link]").val();

        const villageSlug = FlowRouter.getParam('villageSlug') || '/';
        var villageId = Villages.findOne({slug: villageSlug})._id;

        let post = {
            villages: [villageId],
            link: link,
            vidId: vidId,
            type: type,
            thumbnail: $('.uploadedThumbnail').prop("src"),
            artist: $('input[name=post-author]').val(),
            title: $('input[name=post-name]').val(),
            description: $('textarea[name=post-caption]').val(),
            taggedUsers: Tags.get('taggedUsers')
        };

        let fakeUserId = $("#fakeUsersPost").val();
        if (fakeUserId === "") {
            fakeUserId = null;
        }
        console.log(fakeUserId);

        if (type === 'youtube') {
          //Grab duration and insert post
          Meteor.call('insertPostWithDuration', post, fakeUserId, function (error, data) {
            if (error) {
              console.log(error);
            } else if (data) {
              if(!fakeUserId){
                mixpanel.track('Posted a song', {
                  type: post.type,
                  hasDescription: ( post.description ? true : false ),
                  taggedUsersCount: post.taggedUsers.length
                });

                const totalSongsPosted = mixpanel.get_property('totalSongsPosted');
                mixpanel.register({
                    'totalSongsPosted': totalSongsPosted + 1
                });

                mixpanel.people.increment({
                  'totalSongsPosted': 1
                });

                const posts = Posts.find({createdBy: Meteor.userId(), createdAt: { $gte: new Date(new Date().setDate(new Date().getDate()-1)) } }).fetch();
                if(posts.length === 1){
                  mixpanel.people.increment({
                    'daysWithAPost': 1
                  });

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
            }
          });
        } else {
            SC.resolve(link).then(function (track) {
                post.duration = track.duration;
                post.creator = {
                  'username': track.user.username,
                  'link': track.user.permalink_url,
                  'photo': track.user.avatar_url
                }

                //Grab duration and insert post
                Meteor.call('insertPostWithDuration', post, fakeUserId, function (error, data) {
                    if (error) {
                        console.log(error);
                    } else if (data) {
                      console.log(data);
                        appBodyRef.postSuccess.set(data); //_id of newly inserted song
                        resetForm();

                        if(!fakeUserId){
                          mixpanel.track('Posted a song', {
                            type: post.type,
                            hasDescription: ( post.description ? true : false ),
                            taggedUsersCount: post.taggedUsers.length
                          });

                          const totalSongsPosted = mixpanel.get_property('totalSongsPosted');
                          mixpanel.register({
                              'totalSongsPosted': totalSongsPosted + 1
                          });

                          mixpanel.people.increment({
                            'totalSongsPosted': 1
                          });

                          const posts = Posts.find({createdBy: Meteor.userId(), createdAt: { $gte: new Date(new Date().setDate(new Date().getDate()-1)) } }).fetch();
                          if(posts.length === 1){
                            mixpanel.people.increment({
                              'daysWithAPost': 1
                            });
                          }
                        }
                    }
                });
            });
        }
    }
});
