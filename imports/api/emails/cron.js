import { Posts } from '../posts/posts.js';
import { Emails } from '../emails/emails.js';
import { Comments } from '../comments/comments.js';
import  moment  from 'moment';

var nodemailer = require('nodemailer');
var smtpapi    = require('smtpapi');

console.log('Time now ' + new Date());
const t = new Date();
t.setSeconds(t.getSeconds() + 10);
console.log('Setting job to future in 10 seconds ' + t);

SyncedCron.add({
  name: 'noFirstPostWithinADay',
  timezone: 'Australia/Sydney',
  schedule: function(parser) {
    // Run once a day 
    return parser.text('every 24 hours');
  },
  job: function() {
    // Get most upvoted last day Post from each user that posted

    // Define Last 24 hours
    const lastDay = new Date(Date.now() - 1000 * 3600 * 24);

    usersLastDay = Meteor.users.aggregate([
    	{
        "$match": {
          "createdAt": {
            "$gte": lastDay
          }
        }
      }
    ]);

    _(usersLastDay).each(function(user) {

    	// Check if user added post
      postsLastDay = Posts.aggregate([
	    	{
	        "$match": {
            "createdAt": {
              "$gte": lastDay
          	},
          	"createdBy": user._id
	        }
	      },
	      {
	        "$limit": 1
	      }
	    ]);

	    if (postsLastDay.length === 0) {
	    	var header = new smtpapi();

		    var sub = { "-firstname-": [user.services.facebook.first_name] };

		    header.setFilters({
		      "templates": {
		        "settings": {
		          "enable": 1,
		          "template_id": "37f7d999-61b6-4d92-b9a7-2b220559e10e"
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

				  console.log( error || "Message sent");
				});
	    }
    });
  }
});

// Most upvoted users per time period
//
// Most upvoted user per week

SyncedCron.add({
  name: 'mostUpvotedUserWeek',
  timezone: 'Australia/Sydney',
  schedule: function(parser) {
    // run once a week 4:00 pm CEST
    return parser.text('at 00:00 pm on Thursday');
  },
  job: function() {
    // Define Last 7 days
		var lastWeek = new Date();
		lastWeek.setDate(lastWeek.getDate() - 7);

    // Aggregate most upvoted last day user
    var mostUpvotedUser = getMostUpvotedUserInTimeRange (lastWeek);

		var user = Meteor.users.findOne(mostUpvotedUser._id);

		if (user) {

			var header = new smtpapi();

			header.setFilters({
				"templates": {
					"settings": {
						"enable": 1,
						"template_id": "ca4fdc68-8239-4957-846d-b612c4cb62de"
					}
				}
			});

			var sub = {
				"-firstname-": [user.services.facebook.first_name],
				"-timerange-": ['this week'],
			};

			header.setSubstitutions(sub);
			header.setASMGroupID(1237);

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

				console.log( error || "Message sent");
			});
		}
  }
});

// Most upvoted post per month
SyncedCron.add({
  name: 'mostUpvotedUserMonth',
  timezone: 'Australia/Sydney',
  schedule: function(parser) {
    // run once a month on the last day
    return parser.text('on the last day of the month');
  },
  job: function() {
    // Define Last 30 Days
		var lastMonth = new Date();
		lastMonth.setDate(lastMonth.getDate() - 30);

    // Aggregate most upvoted last day user
    var mostUpvotedUser = getMostUpvotedUserInTimeRange (lastMonth);

		var user = Meteor.users.findOne(mostUpvotedUser._id);

		if (user) {

			var header = new smtpapi();

			header.setFilters({
				"templates": {
					"settings": {
						"enable": 1,
						"template_id": "ca4fdc68-8239-4957-846d-b612c4cb62de"
					}
				}
			});

			var sub = {
				"-firstname-": [user.services.facebook.first_name],
				"-timerange-": ['this month'],
			};

			header.setSubstitutions(sub);
			header.setASMGroupID(1237);

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

				console.log( error || "Message sent");
			});
		}
  }
});

// Most upvoted Posts per time period
//
// Most upvoted post per week

SyncedCron.add({
  name: 'mostUpvotedPostWeek',
	timezone: 'Australia/Sydney',
  schedule: function(parser) {
		// run once a week 4:00 pm CEST
    return parser.text('at 00:00 pm on Thursday');
  },
  job: function() {
    // Define Last 7 days
		var lastWeek = new Date();
		lastWeek.setDate(lastWeek.getDate() - 7);

    // Aggregate most upvoted last week post
    var mostUpvotedPost = getMostUpvotedPostInTimeRange( lastWeek );

		var user = Meteor.users.findOne(mostUpvotedPost.createdBy);

		if (user) {

			var header = new smtpapi();

			header.setFilters({
				"templates": {
					"settings": {
						"enable": 1,
						"template_id": "986445bf-35b4-4fd3-a149-3f5d9a1113ba"
					}
				}
			});

			var sub = {
					"-firstname-": [user.services.facebook.first_name],
					"-artist-": [mostUpvotedPost.artist],
					"-trackname-": [mostUpvotedPost.title],
					"-postId-": [mostUpvotedPost._id],
					"-timerange-": ['this week'],
				};

			header.setSubstitutions(sub);
			header.setASMGroupID(1239);

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

				console.log( error || "Message sent");
			});
		}
  }
});

SyncedCron.add({
  name: 'mostUpvotedPostMonth',
	timezone: 'Australia/Sydney',
  schedule: function(parser) {
		// run once a month on the last day
    return parser.text('on the last day of the month');
  },
  job: function() {
    // Define Last 30 Days
		var lastMonth = new Date();
		lastMonth.setDate(lastMonth.getDate() - 30);

    // Aggregate most upvoted last week post
    var mostUpvotedPost = getMostUpvotedPostInTimeRange( lastMonth );

		var user = Meteor.users.findOne(mostUpvotedPost.createdBy);

		if (user) {

			var header = new smtpapi();

			header.setFilters({
				"templates": {
					"settings": {
						"enable": 1,
						"template_id": "986445bf-35b4-4fd3-a149-3f5d9a1113ba"
					}
				}
			});

			var sub = {
					"-firstname-": [user.services.facebook.first_name],
					"-artist-": [mostUpvotedPost.artist],
					"-trackname-": [mostUpvotedPost.title],
					"-postId-": [mostUpvotedPost._id],
					"-timerange-": ['this month'],
				};

			header.setSubstitutions(sub);
			header.setASMGroupID(1239);

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

				console.log( error || "Message sent");
			});
		}
  }
});

SyncedCron.add({
  name: 'aggregateNotifications',
  timezone: 'Asia/Taipei',
  schedule: function(parser) {
    // Run once a day 
    return parser.text('every 24 hours');
  },
  job: function() {
    // Get most upvoted last day Post from each user that posted

    // Define Last 24 hours
    const lastDay = new Date(Date.now() - 1000 * 3600 * 24);

		// Aggreagate most upvoted post of the day
		var mostUpvotedPost = getMostUpvotedPostInTimeRange( lastDay );

		Emails.insert({
			to: mostUpvotedPost.createdBy,
			value: 2,
			meta: {
				artist: mostUpvotedPost.artist,
				postId: mostUpvotedPost._id,
				timeRange: 'this day',
				trackname: mostUpvotedPost.title
			}
		});

		// Aggregate most upvoted user of the day
		var mostUpvotedUser = getMostUpvotedUserInTimeRange (lastDay);

		Emails.insert({
			to: mostUpvotedPost.createdBy,
			value: 1,
			meta: {
				timeRange: 'this day',
			}
		});

    // Aggregate most upvoted last day Post from each user
    usersPostingInLastDayAndMostUpvotedPost = Posts.aggregate([
      {
        "$match": {
          "createdAt": {
            "$gte": lastDay
          },
          "upvotes": {
            "$gte": 2
          },
        }
      },
      // Aggregate all users that posted within last 24 hours
      {
        "$group": {
          "_id": {
            user: "$createdBy",
            post: "$_id"
          },
          "count": {
            $first: "$upvotes"
          },
        }
      }, {
        "$sort": {
          "count": -1
        }
      }, {
        "$group": {
          "_id": "$_id.user",
          "post": {
            $first: {
              id: "$_id.post",
              upvotes: "$count"
            }
          },
        }
      }
    ]);

    _(usersPostingInLastDayAndMostUpvotedPost).each(function(item) {
      // Insert most upvoted post for each user to Emails if larger than 3
    	Emails.insert({
        to: item._id,
        value: 3,
        meta: {
          count: item.post.upvotes,
          postId: item.post.id,
        }
      });
    });
      
    // Aggregate all Emails for user and select most important one
    emails = Emails.aggregate([{
      "$match": {
        "createdAt": {
          "$gte": lastDay
          },
        }
      },
      // Aggregate all emails posted within last 24 hours
      {
        "$group": {
          "_id": {
            user: "$to",
            meta: "$meta"
          },
          "count": {
            $first: "$value"
          },
        }
      }, {
        "$sort": {
          "count": 1
        }
      }, {
        "$group": {
          "_id": "$_id.user",
          "meta": { $first: "$_id.meta"},
          "value": { $first: "$count"}
        }
    }]);

    _(emails).each(function(email) {
    	// Get user details
    	const user = Meteor.users.findOne(email._id);

    	if (user) {
    		const userDetails = user.services.facebook;

    		// Define let statements
	    	let template, sub, post, username, groupId;

	    	// Pick which kind of daily email to send
		    switch (email.value) {
		      case 5:
		        username = Meteor.users.findOne(email.meta.from);
		        post = Posts.findOne(email.meta.postId);

		        template = "81cb32ef-be4a-4f2d-8f59-995a8b7711b6";
		        sub = {
		          "-firstname-": [userDetails.first_name],
		          "-username-": [username ? username.profile.name : null],
		          "-artist-": [post.artist],
		          "-trackname-": [post.title],
							"-postId-": [post._id],
		        };
						groupId = '1243';
		        break;
		      case 4:
		        username = Meteor.users.findOne(email.meta.from);
		        post = Posts.findOne(email.meta.postId);

		        // Aggregate Number of Comments for particular post
		        commentsCount = Comments.aggregate([{
		          "$match": {
		            "postId": post._id,
		          }
		        }, {
		          "$group": {
		            "_id": "$postId",
		            "count": {
		              $sum: 1
		            },
		          }
		        }, ]);

		        template = "c356a9dd-d16d-4f2e-850f-9d17b17ee449";
		        sub = {
		          "-firstname-": [userDetails.first_name],
		          "-username-": [username ? username.profile.name : null],
		          "-comments_count-": [commentsCount[0].count],
		          "-artist-": [post.artist],
		          "-trackname-": [post.title],
							"-postId-": [post._id],
		        };
						groupId = '1241';
		        break;
		      case 3:
		        post = Posts.findOne(email.meta.postId);

		        template = "d0fa08b2-9400-405f-a47e-d09bbda979b1";
		        sub = {
		          "-firstname-": [userDetails.first_name],
		          "-upvotes_count-": [email.meta.count],
		          "-artist-": [post.artist],
		          "-trackname-": [post.title],
							"-postId-": [post._id],
		        };
						groupId = '1245';
		        break;
		      case 2:
		        template = "986445bf-35b4-4fd3-a149-3f5d9a1113ba";

						sub = {
							"-firstname-": [userDetails.first_name],
							"-artist-": [email.meta.artist],
							"-trackname-": [email.meta.title],
							"-postId-": [email.meta.postId],
							"-timerange-": [email.meta.timeRange],
						};
						groupId = '1239';
		        break;
		      case 1:
		        template = "ca4fdc68-8239-4957-846d-b612c4cb62de";

						sub = {
							"-firstname-": [userDetails.first_name],
							"-timerange-": [email.meta.timeRange],
						};
						groupId = '1237';
		        break;
		      default:
		        break;
		    }

		    var header = new smtpapi();

		    header.setFilters({
		      "templates": {
		        "settings": {
		          "enable": 1,
		          "template_id": template
		        }
		      }
		    });

		    header.setSubstitutions(sub);
				header.setASMGroupID(groupId);

		    // Send usin Nodemailer
				var headers = { "x-smtpapi": header.jsonString() };

				var smtpTransport = nodemailer.createTransport(GlobalServer.emailSettings);

				var mailOptions = {
				  from:     "Village.fm <yourfriends@village.fm>",
				  to:       userDetails.email,
				  text:     "Hello world",
				  html:     "<b>Hello world</b>",
				  headers:  headers
				}

				smtpTransport.sendMail(mailOptions, function(error, response) {
				  smtpTransport.close();

				  console.log( error || "Message sent to: "+userDetails.email);
				});
      }
    });
  }
});

SyncedCron.start();

function getMostUpvotedPostInTimeRange (timeRange) {
	mostUpvotedPost = Posts.aggregate([
		{
			"$match": {
				"createdAt": {
					"$gte": timeRange
				}
			}
		}, {
			"$sort": {
				"upvotes": -1
			}
		}, {
			"$limit": 1
		}
	]);

	return mostUpvotedPost[0];
}

function getMostUpvotedUserInTimeRange (timeRange) {
	mostUpvotedUser = Posts.aggregate([
		{
			"$match": {
				"createdAt": {
					"$gte": timeRange
				}
			}
		}, {
			"$group": {
				"_id": "$createdBy",
				"upvotes": { $sum: "$upvotes"},
			}
    },{
			"$sort": {
				"upvotes": -1
			}
		}, {
			"$limit": 1
		}
	]);

	return mostUpvotedUser[0];
}