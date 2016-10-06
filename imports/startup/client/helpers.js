import {Posts} from "../../api/posts/posts.js";

Meteor.subscribe("users.allData");


UI.registerHelper("isMainVillage", function (slug) {
    return (slug === '/' || slug === 'main');
});

UI.registerHelper("sSubVillage", function () {
    return FlowRouter.getParam('villageSlug');
});

UI.registerHelper("postsLoadedDone", function () {
  return appBodyRef.postsLoadedDone.get();
});

UI.registerHelper("skeletonPosts", function () {
  return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19];
});

UI.registerHelper("getUserImage", function (userId) {
    let user = Meteor.users.findOne({_id: userId});
    if (user)
        return user.profile.picture;
});

UI.registerHelper("getUserName", function (userId, length) {
    let user = Meteor.users.findOne(userId);
    if (user) {
        if (length === 'first') {
            if (user.services.facebook) {
                if (user.services.facebook.first_name) {
                    return user.services.facebook.first_name;
                }
                else {
                    return "The Village";
                }
            }
            else {
                return user.profile.name;
            }
        }
        else {
            return user.profile.name;
        }
    }
});

UI.registerHelper("profilePadding", function () {
    return FlowRouter.current().route.name == "Profile" ? '--profile-page' : '';
});

UI.registerHelper("ownProfile", function () {
    return (FlowRouter.current().params._id == Meteor.userId() ? true : false );
});

UI.registerHelper("getUserVillagerNum", function (userId) {
    let user = Meteor.users.findOne({_id: userId});
    if (user) {
        return user.profile.villagerNum;
    } else {
        return '100';
    }
});

UI.registerHelper("getUpvotesNum", function (userId) {
    let posts = Posts.find({"createdBy": userId}).fetch();
    let upvotesCollected = 0;
    posts.forEach(function (post) {
        upvotesCollected += post.upvotes;
    });

    return upvotesCollected;
});


UI.registerHelper("getUserUpvoteRank", function (userId) {
    let user = Meteor.users.findOne({_id: userId});
    if (user) {
        let users = Meteor.users.find({});
        let sortable = [];
        users.forEach(function (userX) {
            let posts = Posts.find({"createdBy": userX._id}).fetch();
            let upvotesCollected = 0;
            posts.forEach(function (post) {
                upvotesCollected += post.upvotes;
            });
            sortable.push([userX._id, upvotesCollected]);
        });
        sortable.sort(function (a, b) {
            return b[1] - a[1]
        });
        let rankList = _.pluck(sortable, 0);
        return (rankList.indexOf(userId) + 1);
    }
});

UI.registerHelper("getNumberEnd", function (num) {
    let numString = '0';
    if (num) {
        numString = num.toString();
    }
    let last = numString[(numString.length - 1)];
    switch (last) {
        case '1':
            return 'st'
            break;
        case '2':
            return 'nd'
            break;
        case '3':
            return 'rd'
            break;
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
        case '0':
            return 'th'
            break;
        default:
            return ''
    }
});

UI.registerHelper("completed", function () {
  let completed = appBodyRef.completed.get();   //Get current time of video
  var minutes, seconds;

  if (('' + moment.duration(completed, 'seconds')._data.seconds).length === 1) {  //0:1 -> 0:01
    seconds = '0' + moment.duration(completed, 'seconds')._data.seconds;
  } else {
    seconds = moment.duration(completed, 'seconds')._data.seconds;  //Leave 0:25 as is
  }

  minutes = moment.duration(completed, 'seconds')._data.minutes;

  return (minutes + ':' + seconds);
});

UI.registerHelper("completedPercentage", function () {
  let completed = appBodyRef.completed.get();
  let duration = '00:' + this.duration; //5:08 -> 00:05:08 for moment weirdness

  //Divide current time in seconds by duration in seconds to get 0.XXXXXXX percentage
  let completedPercentage = ''+(moment.duration(completed, 'seconds').asSeconds())/(moment.duration(duration, "mm:ss").asSeconds());

  //Only take first 5 characters (including decimal) so 0.XXX, multiple by 100 and add % -> "XX.X%"
  return (completedPercentage.substring(0,5) * 100);
});

UI.registerHelper("nowPlaying", function () {
  let nowPlayingPost = appBodyRef.nowPlaying.get();
  if (nowPlayingPost) {
    return nowPlayingPost;
  }
});

UI.registerHelper("getVillage", function () {
  return Villages.findOne();
});

UI.registerHelper("bannerShown", function () {
  if (FlowRouter.getParam('villageSlug') === 'tuneintelaviv') {
    return (appBodyRef.tuneInBanner.get()) ? true : false;
  } else {
    return false;
  }
});
