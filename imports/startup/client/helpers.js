UI.registerHelper("getUserImage", function (userId) {
    var user = Meteor.users.findOne({_id: userId});
    return user.profile.picture;
});

UI.registerHelper("getUserName", function (userId, length) {
    var user= Meteor.users.findOne(userId);
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

});
