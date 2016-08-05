import { Posts } from '../posts/posts.js';
import { Emails } from '../emails/emails.js';
import { Comments } from '../comments/comments.js'; 

console.log('Time now ' + new Date());
const t = new Date();
t.setSeconds(t.getSeconds() + 10);
console.log('Setting job to future in 10 seconds ' + t);

SyncedCron.add({
  name: 'aggregateNotifications',
  schedule: function (parser) {
  	// Run once a day 
    return parser.text('every 30 seconds');
  },
  job: function () {
		// Get most upvoted last day Post from each user that posted
  	
  	// Define Last 24 hours
  	const lastDay = new Date(Date.now() - 1000 * 3600 * 24);

  	// Aggregate most upvoted last day Post from each user
  	usersPostingInLastDayAndMostUpvotedPost = Posts.aggregate([
      { "$match": {
        "createdAt": { "$gte": lastDay },
        "upvotes": { "$gte": 0 },
      }},
      // Aggregate all users that posted within last 24 hours
      { "$group": {
        "_id": { user: "$createdBy", post: "$_id"},
        "count": {$first: "$upvotes"},
      }},
      { "$sort" : { 
        "count" : -1 
      }},
      { "$group": {
        "_id": "$_id.user",
        "post": { $first: { id: "$_id.post", upvotes: "$count" }}, 
      }}
  	]);

  	_(usersPostingInLastDayAndMostUpvotedPost).each(function(item) {
      // Insert most upvoted post for each user to Emails
      Emails.insert({
		    to: item._id,
		    value: 3,
		    meta: {
		      count: item.post.upvotes,
		      postId: item.post.id,
		    }
		  });

      // Aggregate all Emails for user and select most important one
      email = Emails.aggregate([
      	{ "$match": {
	        "createdAt": { "$gte": lastDay },
	        "to": item._id,
	      }},
	      { "$sort" : { 
	        "value" : 1 
	      }},
	      { "$limit" : 1 }
      ]);

      // Switch array of single item to object
      const emailItem = email[0];

      // Get user details
      const userDetails = Meteor.users.findOne(item._id).services.facebook;

      // Define let statements
      let template, sub, post, username;

      // Pick which kind of daily email to send
      switch (emailItem.value) {
				case 5:
					username = Meteor.users.findOne(emailItem.meta.from).profile.name;
					post = Posts.findOne(emailItem.meta.postId);

				  template = "81cb32ef-be4a-4f2d-8f59-995a8b7711b6";
				  sub = {
				    "{firstname}": userDetails.first_name,
		        "{username}": username,
		        "{artist}": post.artist,
		        "{trackname}": post.title,
				  };
				  break;
				case 4:
				  username = Meteor.users.findOne(emailItem.meta.from).profile.name;
					post = Posts.findOne(emailItem.meta.postId);

					// Aggregate Number of Comments for particular post
		      commentsCount = Comments.aggregate([
		      	{ "$match": {
			        "postId": post._id,
			      }},
			      { "$group": {
			        "_id": "$postId",
			        "count": { $sum: 1 },
			      }},
		      ]);

				  template = "c356a9dd-d16d-4f2e-850f-9d17b17ee449";
				  sub = {
				    "{firstname}": userDetails.first_name,
		        "{username}": username,
		        "{comments_count}": commentsCount[0].count,
		        "{artist}": post.artist,
		        "{trackname}": post.title,
				  };
				  break;
				case 3:
					post = Posts.findOne(emailItem.meta.postId);

				  template = "d0fa08b2-9400-405f-a47e-d09bbda979b1";
				  sub = {
				    "{firstname}": userDetails.first_name,
		        "{upvotes_count}": emailItem.meta.count,
		        "{artist}": post.artist,
		        "{trackname}": post.title,
				  };
				  break;
				case 2:
					// Need to build a function to get emails
				  template = "986445bf-35b4-4fd3-a149-3f5d9a1113ba";
				  break;
				case 1:
				  // Need to build a function to get emails
				  template = "ca4fdc68-8239-4957-846d-b612c4cb62de";
				  break;
		    default:
        	break;
			}

			const xsmtpapi = {
			  "filters": {
			    "templates": {
			      "settings": {
			        "enable": 1,
			        "template_id": template
			      }
			    }
			  },
			  "sub": sub,
			}

      // Send daily email
      Email.send({
	      from: "hello@village.fm",
	      to:userDetails.email,
	      headers: {
	        "X-SMTPAPI": JSON.stringify(xsmtpapi),
	        "Content-Type" : "text/html"
	      }
	    });
    });
  }
});

// SyncedCron.start();