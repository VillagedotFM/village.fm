Template.upload.helpers({
    chars() {
      return Template.instance().chars.get();
    },
    showError() {
      return (appBodyRef.notFound.get() || appBodyRef.duplicate.get());
    },
    notFound() {
        return appBodyRef.notFound.get();
    },
    duplicate() {
        return appBodyRef.duplicate.get();
    },
    postSuccess() {
        return app.postSuccess.get();
    },
    postError() {
        return Template.instance().postError.get();
    },
    showForm() {
        return appBodyRef.showForm.get();
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
