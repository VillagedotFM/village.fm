Accounts.onCreateUser(function(options, user) {
    if (options.profile) {  //Add facebook profile picture
        options.profile.picture = "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
        user.profile = options.profile;
    }
    return user;
});
