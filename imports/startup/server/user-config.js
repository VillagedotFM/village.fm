Accounts.onCreateUser(function (options, user) {
    if (user.services.facebook) {

        if (options.profile) {  //Add facebook profile picture and tweak name
            options.profile.picture = "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
            options.profile.name = user.services.facebook.first_name + " " + user.services.facebook.last_name.charAt(0);
            user.profile = options.profile;
        }

        let email = user.services.facebook.email;
        if (email === "cristi.ambrozie@gmail.com" || email === "danny@village.fm " ||
            email === " jason@village.fm" || email === " nate@village.fm") {
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
