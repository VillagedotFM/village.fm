import {Template} from "meteor/templating";
import "./upload.html";
import "./helpers.js";
import "./events.js";

ytApiKey = Meteor.settings.public.youtube.key;

Template.upload.onCreated(function uploadOnCreated() {
    Meteor.subscribe("users.allFakeUsers");

    uploadRef = this;

    //TODO: use these once we have designs
    uploadRef.notFound = new ReactiveVar(false);
    uploadRef.duplicate = new ReactiveVar(null);
    uploadRef.postSuccess = new ReactiveVar(null);
    uploadRef.postError = new ReactiveVar(false);

    uploadRef.missingData = new ReactiveVar(false);
    uploadRef.showForm = new ReactiveVar(false);

    //Reactive elements to display in form after link is submitted
    uploadRef.uploadedThumbnail = new ReactiveVar(null);
    uploadRef.uploadedArtist = new ReactiveVar(null);
    uploadRef.uploadedTitle = new ReactiveVar(null);
});
