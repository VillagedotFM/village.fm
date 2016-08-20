import {FlowRouter} from "meteor/kadira:flow-router";
import {BlazeLayout} from "meteor/kadira:blaze-layout";
import "../../ui/layouts/body.js";
import "../../ui/layouts/adminLayout.js";
import "../../ui/components/profile/profile.js";

import { Posts } from '/imports/api/posts/posts.js';
import { Villages } from '/imports/api/villages/villages.js';


// options: profile, tabs (tabs/profile_tabs), inbox, upload, invite

FlowRouter.route('/', {
    name: 'Home',
    action(params, queryParams) {
        BlazeLayout.render('app_body', {tabs: 'tabs', upload: 'upload', invite: 'invite'});
        
        mixpanel.track('Page Visit', {
            type: 'Village',
            name: 'Main Village'
        });

        const totalVillagesVisited = mixpanel.get_property('totalVillagesVisited');
        mixpanel.register({
            'totalVillagesVisited': totalVillagesVisited + 1
        });

        mixpanel.people.increment({
            'totalVillagesVisited': 1
        });
    }
});

FlowRouter.route('/:villageSlug', {
    name: 'Village',
    action(params, queryParams) {
        BlazeLayout.render('app_body', {tabs: 'tabs', upload: 'upload', invite: 'invite'});

        const village = Villages.findOne({slug: params.villageSlug});
        console.log(village);
        if(village){
            mixpanel.track('Page Visit', {
                type: 'Village',
                name: village.name + ' Village'
            });

            const totalVillagesVisited = mixpanel.get_property('totalVillagesVisited');
            mixpanel.register({
                'totalVillagesVisited': totalVillagesVisited + 1
            });

            mixpanel.people.increment({
                'totalVillagesVisited': 1
            });
        }
    }
});

FlowRouter.route('/post/:postId', {  //Permalink
    name: 'Post',
    action(params, queryParams) {
        BlazeLayout.render('app_body', {tabs: 'tabs', upload: 'upload', invite: 'invite'});

        const post = Posts.findOne({_id: params.postId});
        if(post){
            mixpanel.track('Page Visit', {
                type: 'Post',
                name: post.artist + ' - ' + post.title + ' Post'
            });

            const totalPostsVisited = mixpanel.get_property('totalPostsVisited');
            mixpanel.register({
                'totalPostsVisited': totalPostsVisited + 1
            });

            mixpanel.people.increment({
                'totalPostsVisited': 1
            });
        }
    }
});

FlowRouter.route('/:villageSlug/post/:postId', {
    name: 'Post',
    action(params, queryParams) {
        BlazeLayout.render('app_body', {tabs: 'tabs', upload: 'upload', invite: 'invite'});

        const post = Posts.findOne({_id: params.postId});
        if(post){
            mixpanel.track('Page Visit', {
                type: 'Post',
                name: post.artist + ' - ' + post.title + ' Post'
            });

            const totalPostsVisited = mixpanel.get_property('totalPostsVisited');
            mixpanel.register({
                'totalPostsVisited': totalPostsVisited + 1
            });

            mixpanel.people.increment({
                'totalPostsVisited': 1
            });
        }
    }
});

FlowRouter.route('/profile/:_id', {
    name: 'Profile',
    action(params, queryParams) {
        BlazeLayout.render('app_body', {profile: 'profile', tabs: 'profile_tabs'});

        const user = Meteor.users.findOne({_id: params._id});

        if(user){
            if(Meteor.userId() == user._id){
               
            } else {

            }
             mixpanel.track('Page Visit', {
                type: ( Meteor.userId() == user._id ? 'Own Profile' : 'Other Profile'),
                name: user.profile.name
            });
        }
        
    }
});

FlowRouter.triggers.enter(function() {
    if(Meteor.userId()){
        mixpanel.identify(Meteor.userId());
    }
});

// ADMIN ROUTES

var adminRoutes = FlowRouter.group({
    prefix: '/admin',
    name: 'admin'
});

adminRoutes.route('/fakeUsers', {
    name: 'admin-fakeUsers',
    action(params, queryParams) {
        BlazeLayout.render('admin_body', {content: 'fakeUsers'});
    },
});

FlowRouter.notFound = {
    action(params, queryParams) {
        //TODO: add template for not found
    },
};
