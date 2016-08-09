import { Meteor } from 'meteor/meteor';

var nodemailer = require('nodemailer');
var smtpapi    = require('smtpapi');

if(Meteor.isServer){
	Meteor.users.after.insert( function (userId) {
    // Get user details
    const user = Meteor.users.findOne(item._id).services.facebook;

    var header = new smtpapi();

    header.setFilters({
      "templates": {
        "settings": {
          "enable": 1,
          "template_id": "ce551d09-ce7d-4a48-b5b9-653ad2789702"
        }
      }
    });

    header.addSubstitution("-firstname-": user.first_name)

    // Send usin Nodemailer
		var headers = { "x-smtpapi": header.jsonString() };

		var smtpTransport = nodemailer.createTransport(GlobalServer.emailSettings);

		var mailOptions = {
		  from:     "Village.fm <hello@village.fm>",
		  to:       user.email,
		  text:     "Hello world",
		  html:     "<b>Hello world</b>",
		  headers:  headers
		}

		smtpTransport.sendMail(mailOptions, function(error, response) {
		  smtpTransport.close();

		  console.log( error || "Message sent");
		});
	});
};