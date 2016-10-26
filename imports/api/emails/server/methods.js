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
  },
  requestVillage: function(submitterEmail, category) {
    let smtpTransport = nodemailer.createTransport(GlobalServer.emailSettings);

    let messageText = `${submitterEmail} has requested a Village` + (!!category ? ` for their ${category}` : "" ) + ". Awesome!";

    let mailOptions = {
      from:     submitterEmail,
      to:       "yourfriends@village.fm",
      subject:  "New Village Request",
      text:     messageText,
    }

    smtpTransport.sendMail(mailOptions, function(error, response) {
      smtpTransport.close();

      console.log( error || "Message sent - New Village Request from: "+submitterEmail);
    });
  }
});
