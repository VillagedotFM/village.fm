Accounts.onCreateUser(function (options, user) {
    if (options.profile) {  //Add facebook profile picture
        options.profile.picture = "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
        user.profile = options.profile;
    }

    //TODO check all admin emails and admin roles
    if (user.services.facebook) {
        let email = user.services.facebook.email;
        if (email === "cristi.ambrozie@gmail.com") {
            user.roles = ['admin'];
        }
        else {
            user.roles = ["client"];
        }
    }
    return user;
});
