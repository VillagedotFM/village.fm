UI.registerHelper("getUserImage", function (userId) {
    let user = Meteor.users.findOne({_id: userId});
    if(userId)
      return user.profile.picture;
});

UI.registerHelper("getUserName", function (userId, length) {
    let user = Meteor.users.findOne(userId);
    if(user) {
      if(length === 'first') {
        if (user.services.facebook.first_name)
        {
          return user.services.facebook.first_name;
        }
        else
        {
            return "The Village";
        }
      }
      else {
        return user.profile.name;
      }
    }
});
