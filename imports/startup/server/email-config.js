Meteor.startup(function () {
  process.env.MAIL_URL = 'smtp://Mattej.village:Village123@smtp.sendgrid.net:587';
});