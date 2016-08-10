import { Villages } from '../../api/villages/villages.js';

Accounts.onCreateUser(function(options, user) {
    if (options.profile) {  //Add facebook profile picture
        options.profile.picture = "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
        user.profile = options.profile;
    }

    //Add user to main village
    let villageId = Villages.findOne({})._id;
    Villages.update({_id:villageId}, {
      $addToSet: {
          users: user._id
      }
    });

    return user;
});
