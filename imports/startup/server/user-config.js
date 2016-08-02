Accounts.onCreateUser(function (options, user) {
    if (user.services.facebook) {

        if (options.profile) {  //Add facebook profile picture
            options.profile.picture = "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
            user.profile = options.profile;
        }

        //TODO check all admin emails and admin roles
        let email = user.services.facebook.email;
        if (email === "cristi.ambrozie@gmail.com") {
            user.roles = ['admin'];
        }
        else {
            user.roles = ["client"];
        }
    }
    else {
        user.profile = options.profile;
    }
    return user;
});
