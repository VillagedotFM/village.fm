import { Template } from 'meteor/templating';

import './upload.html';
import './helpers.js';
import './events.js';

ytApiKey = Meteor.settings.public.youtube.key;

Template.upload.onCreated(function uploadOnCreated() {
  uploadRef = this;

  //TODO: use these once we have designs
  uploadRef.notFound = new ReactiveVar(false);
  uploadRef.duplicate = new ReactiveVar(null);
  uploadRef.postSuccess = new ReactiveVar(null);
  uploadRef.postError = new ReactiveVar(false);
});
