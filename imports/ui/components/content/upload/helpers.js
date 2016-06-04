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
  postError() {
    return Template.instance().postError.get();
  },
  showForm() {
    return Template.instance().showForm.get();
  },
  uploadedThumbnail() {
    return Template.instance().uploadedThumbnail.get();
  },
  uploadedArtist() {
    return Template.instance().uploadedArtist.get();
  },
  uploadedTitle() {
    return Template.instance().uploadedTitle.get();
  }
});
