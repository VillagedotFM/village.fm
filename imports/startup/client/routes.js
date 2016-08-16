import {FlowRouter} from "meteor/kadira:flow-router";
import {BlazeLayout} from "meteor/kadira:blaze-layout";
import "../../ui/layouts/body.js";
import "../../ui/layouts/adminLayout.js";
import "../../ui/components/profile/profile.js";

// options: profile, tabs (tabs/profile_tabs), inbox, upload, invite

FlowRouter.route('/', {
    name: 'Home',
    action() {
        BlazeLayout.render('app_body', {tabs: 'tabs', inbox: 'inbox', upload: 'upload', invite: 'invite'});
    },
});

FlowRouter.route('/:villageSlug', {
    name: 'Village',
    action() {
        BlazeLayout.render('app_body', {tabs: 'tabs', inbox: 'inbox', upload: 'upload', invite: 'invite'});
    },
});

FlowRouter.route('/post/:postId', {  //Permalink
    name: 'Post',
    action() {
        BlazeLayout.render('app_body', {tabs: 'tabs', inbox: 'inbox', upload: 'upload', invite: 'invite'});
    },
});

FlowRouter.route('/:_id', {
    name: 'Profile',
    action() {
        BlazeLayout.render('app_body', {profile: 'profile', tabs: 'profile_tabs'});
    },
});

// ADMIN ROUTES

var adminRoutes = FlowRouter.group({
    prefix: '/admin',
    name: 'admin'
});

adminRoutes.route('/fakeUsers', {
    name: 'admin-fakeUsers',
    action() {
        BlazeLayout.render('admin_body', {content: 'fakeUsers'});
    },
});

FlowRouter.notFound = {
    action() {
        //TODO: add template for not found
    },
};
