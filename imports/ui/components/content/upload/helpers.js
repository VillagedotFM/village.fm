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
});
