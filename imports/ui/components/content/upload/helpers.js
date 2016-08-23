Template.upload.helpers({
    chars() {
      return Template.instance().chars.get();
    },
    showError() {
      return (Template.instance().notFound.get() || Template.instance().duplicate.get());
    },
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
    },
    settings() {
        return {
            position: "below",
            limit: 5,
            rules: [
                {
                    token: '',
                    collection: Meteor.users,
                    field: "profile.name",
                    template: Template.userPill
                }
            ]
        };
    },

    fakeUsers: function () {
        return Meteor.users.find({
            roles: 'fakeUser'
        }).fetch();
    },
});
