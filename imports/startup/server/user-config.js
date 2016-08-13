import { Villages } from '../../api/villages/villages.js';

var nodemailer = require('nodemailer');
var smtpapi    = require('smtpapi');

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

    //Add user to main village
    let villageId = Villages.findOne({})._id;
    Villages.update({_id:villageId}, {
      $addToSet: {
          users: user._id
      }
    });

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
		  from:     "Village.fm <hello@village.fm>",
		  to:       user.services.facebook.email,
		  text:     "Hello world",
		  html:     "<b>Hello world</b>",
		  headers:  headers
		}

		smtpTransport.sendMail(mailOptions, function(error, response) {
		  smtpTransport.close();

		  console.log( error || "Message sent");
		});

    return user;
});
