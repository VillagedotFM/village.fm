import { Meteor } from 'meteor/meteor';

var nodemailer = require('nodemailer');

Meteor.methods({
  submitFeedbackForm: function(submitterEmail, submitterName, feedbackText) {
    var smtpTransport = nodemailer.createTransport(GlobalServer.emailSettings);

    var mailOptions = {
      from:     submitterEmail,
      to:       "yourfriends@village.fm",
      subject:  "Feedback from "+ submitterName,
      text:     feedbackText,
    }

    smtpTransport.sendMail(mailOptions, function(error, response) {
      smtpTransport.close();

      console.log( error || "Message sent - Feedback send from: "+submitterEmail);
    });
  }
});