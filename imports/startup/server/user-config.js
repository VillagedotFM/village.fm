import { Villages } from '../../api/villages/villages.js';
import { Profiles } from '../../api/profiles/profiles.js';

var nodemailer = require('nodemailer');
var smtpapi    = require('smtpapi');

Accounts.onCreateUser(function (options, user) {
    if (user.services.facebook) {

        var villagerNum = 1;
        var profileWithHighestNum = Profiles.findOne({}, { sort: { 'villagerNum': 1 } });

        if(profileWithHighestNum){
          villagerNum = profileWithHighestNum.villagerNum + 1;
        }

        Profiles.insert({
          firstName: user.services.facebook.first_name,
          lastName: user.services.facebook.last_name,
          gender: user.services.facebook.gender,
          ageRange: user.services.facebook.age_range,
          niceName: user.services.facebook.first_name + " " + user.services.facebook.last_name.charAt(0),
          villagerNum: villagerNum,
          picture: "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large",
          createdBy: user._id
        });

        if (options.profile) {  //Add facebook profile picture and tweak name
            options.profile.picture = "https://graph.facebook.com/" + user.services.facebook.id + "/picture/?type=large";
            options.profile.name = user.services.facebook.first_name + " " + user.services.facebook.last_name.charAt(0);
            // FIX: Find another way how to know that a new user is logging in
            options.profile.newUser = true;
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

    //Add user to main village
    let villageId = Villages.findOne({})._id;
    Villages.update({_id:villageId}, {
      $addToSet: {
          users: user._id
      }
    });

    //Assign villager Number
    var users = Meteor.users.find({});
    var max = 0;
    users.forEach(function(user) {
      if (user.profile.villagerNum) {
        if (user.profile.villagerNum > max) {
          max = user.profile.villagerNum;
        }
      }
    });
    user.profile.villagerNum = max + 1;

    //send email to facebook user (fake users are normal users with password and don't require emails being sent)
    /**
     * TODO: perhaps move this into a method outside this one and call it here,
     * TODO: it will also remove the double check for facebook:  if (user.services.facebook) {..}
     */

    if (user.services.facebook) {
        var header = new smtpapi();

        var sub = { "-firstname-": [user.services.facebook.first_name] };

        header.setFilters({
            "templates": {
                "settings": {
                    "enable": 1,
                    "template_id": "ce551d09-ce7d-4a48-b5b9-653ad2789702"
                }
            }
        });

        header.setSubstitutions(sub);

        // Send usin Nodemailer
        var headers = { "x-smtpapi": header.jsonString() };

        var smtpTransport = nodemailer.createTransport(GlobalServer.emailSettings);

        var mailOptions = {
            from:     "Village.fm <yourfriends@village.fm>",
            to:       user.services.facebook.email,
            text:     "Hello world",
            html:     "<b>Hello world</b>",
            headers:  headers
        }

        smtpTransport.sendMail(mailOptions, function(error, response) {
            smtpTransport.close();

            console.log( error || "Welcome Email to: "+ user.services.facebook.email +" - Message sent");
        });
    }

    return user;
});
