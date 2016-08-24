import {Posts} from "../../api/posts/posts.js";

Meteor.subscribe("users.allData");


UI.registerHelper("videoReady", function (index) {
    return (_.contains(appBodyRef.videosReady.list(), index));
});

UI.registerHelper("isMainVillage", function (slug) {
    return (slug === '/');
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
