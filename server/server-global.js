GlobalServer = {};

// Use nodemailer to send the email
GlobalServer.emailSettings = {
  host: "smtp.sendgrid.net",
  port: parseInt(587, 10),
  requiresAuth: true,
  auth: {
    user: "Mattej.village",
    pass: "Village123"
  }
};
