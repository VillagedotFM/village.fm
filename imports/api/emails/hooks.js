import { Meteor } from 'meteor/meteor';

if(Meteor.isServer){
	Meteor.users.after.insert( function (userId) {
    // Get user details
    const user = Meteor.users.findOne(item._id).services.facebook;
			
    const xsmtpapi = {
			  "filters": {
			    "templates": {
			      "settings": {
			        "enable": 1,
			        "template_id": "ce551d09-ce7d-4a48-b5b9-653ad2789702",
			      }
			    }
			  },
			  "sub": {
				  "{firstname}": user.first_name,
			  },
			}

      // Send daily email
      Email.send({
	      from: "hello@village.fm",
	      to: user.email,
	      headers: {
	        "X-SMTPAPI": JSON.stringify(xsmtpapi),
	        "Content-Type" : "text/html"
	      }
	    });
	});
};