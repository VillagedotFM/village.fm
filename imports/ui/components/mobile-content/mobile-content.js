import './mobile-content.html';
import './events.js';
import './helpers.js';

ytApiKey = Meteor.settings.public.youtube.key;

Template.mobile_content.onCreated(function uploadOnCreated() {
  mobileUploadRef = this;

  //TODO: use these once we have designs
  mobileUploadRef.notFound = new ReactiveVar(false);
  mobileUploadRef.duplicate = new ReactiveVar(null);
  mobileUploadRef.postSuccess = new ReactiveVar(null);
  mobileUploadRef.postError = new ReactiveVar(false);

  mobileUploadRef.missingData = new ReactiveVar(false);
  mobileUploadRef.showForm = new ReactiveVar(false);

  //Reactive elements to display in form after link is submitted
  mobileUploadRef.uploadedThumbnail = new ReactiveVar(null);
  mobileUploadRef.uploadedArtist = new ReactiveVar(null);
  mobileUploadRef.uploadedTitle = new ReactiveVar(null);
});
