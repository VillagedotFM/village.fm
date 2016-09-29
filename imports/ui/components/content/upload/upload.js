import {Template} from "meteor/templating";
import "./upload.html";
import "./helpers.js";
import "./events.js";

ytApiKey = Meteor.settings.public.youtube.key;

Template.upload.onCreated(function uploadOnCreated() {
    Meteor.subscribe("users.allFakeUsers");

    uploadRef = this;

    //TODO: use these once we have designs
    uploadRef.notFound = appBodyRef.upload.notFound;
    uploadRef.duplicate = appBodyRef.upload.duplicate;

    uploadRef.postError = appBodyRef.upload.postError;

    uploadRef.missingData = appBodyRef.upload.missingData;
    uploadRef.showForm = appBodyRef.upload.showForm;

    //Reactive elements to display in form after link is submitted
    uploadRef.uploadedThumbnail = appBodyRef.upload.uploadedThumbnail;
    uploadRef.uploadedArtist = appBodyRef.upload.uploadedArtist;
    uploadRef.uploadedTitle = appBodyRef.upload.uploadedTitle;
    uploadRef.chars = appBodyRef.upload.chars;
});
