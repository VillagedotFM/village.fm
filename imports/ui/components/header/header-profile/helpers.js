import {Posts} from "../../../../api/posts/posts.js";


Template.header_profile.helpers({
    postCount: function () {
        return Posts.find({"createdBy": Meteor.userId()}).count();
    }
});
