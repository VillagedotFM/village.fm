import {FlowRouter} from "meteor/kadira:flow-router";
import {BlazeLayout} from "meteor/kadira:blaze-layout";
import "../../ui/layouts/body.js";
import "../../ui/layouts/adminLayout.js";
import "../../ui/layouts/home-page/home-page.js";
import "../../ui/components/profile/profile.js";

import { Posts } from '/imports/api/posts/posts.js';
import { Villages } from '/imports/api/villages/villages.js';


// options: profile, tabs (tabs/profile_tabs), inbox, upload, invite

FlowRouter.triggers.enter(function() {
    if(Meteor.userId()){
        mixpanel.identify(Meteor.userId());
    }

    mixpanel.people.increment({
        'totalPagesVisited': 1
    });

    window.analytics.totalPagesVisited = window.analytics.totalPagesVisited + 1;
    console.log(window.analytics.totalPagesVisited);
    mixpanel.register({
        'totalPagesVisited': window.analytics.totalPagesVisited
    });
});

FlowRouter.route('/', {
    name: 'Home',
    action(params, queryParams) {
        BlazeLayout.render('home_page');

        // Append custom stylesheet for home page
        let link = document.createElement("link");
        link.href = "/css/home-page/main.css";
        link.type = "text/css";
        link.rel = "stylesheet";
        document.head.appendChild(link);

        mixpanel.track('Landing Page Visit');
    }
});

FlowRouter.route('/all', {
    name: 'All',
    action(params, queryParams) {
        BlazeLayout.render('app_body', {tabs: 'tabs', upload: 'upload', invite: 'invite'});

        $('.sr-playlist').scrollTop(0);
        $('.wrapper').scrollTop(0);
        $('body').scrollTop(0);

        window.analytics.totalVillagesVisited = window.analytics.totalVillagesVisited + 1;
        mixpanel.register({
            'totalVillagesVisited': window.analytics.totalVillagesVisited
        });

        mixpanel.register({
            'villageName': 'main village'
        });

        mixpanel.people.increment({
            'totalVillagesVisited': 1
        });

        mixpanel.track('Page Visit', {
            type: 'Village',
            name: 'main village'
        });
    }
});

FlowRouter.route('/:villageSlug', {
    name: 'Village',
    action(params, queryParams) {
        BlazeLayout.render('app_body', {tabs: 'tabs', upload: 'upload', invite: 'invite'});
        $('.sr-playlist').scrollTop(0);
        $('.wrapper').scrollTop(0);
        $('body').scrollTop(0);

        window.analytics.totalVillagesVisited = window.analytics.totalVillagesVisited + 1;
        mixpanel.register({
            'totalVillagesVisited': window.analytics.totalVillagesVisited
        });

        mixpanel.register({
            'villageName': params.villageSlug + ' village'
        });

        mixpanel.people.increment({
            'totalVillagesVisited': 1
        });

        mixpanel.track('Page Visit', {
            type: 'Village',
            name: params.villageSlug + ' village'
        });

    }
});

FlowRouter.route('/post/:postId', {  //Permalink
    name: 'Post',
    action(params, queryParams) {
        BlazeLayout.render('app_body', {tabs: 'tabs', upload: 'upload', invite: 'invite'});
        $('.sr-playlist').scrollTop(0);
        $('.wrapper').scrollTop(0);
        $('body').scrollTop(0);

        window.analytics.totalVillagesVisited = window.analytics.totalVillagesVisited + 1;
        mixpanel.register({
            'totalVillagesVisited': window.analytics.totalVillagesVisited
        });

        mixpanel.people.increment({
            'totalPostsVisited': 1
        });

        mixpanel.track('Page Visit', {
            type: 'Post',
            name: params.postId + ' post'
        });

    }
});

FlowRouter.route('/:villageSlug/post/:postId', {
    name: 'Post',
    action(params, queryParams) {
        BlazeLayout.render('app_body', {tabs: 'tabs', upload: 'upload', invite: 'invite'});
        $('.sr-playlist').scrollTop(0);
        $('.wrapper').scrollTop(0);
        $('body').scrollTop(0);

        window.analytics.totalVillagesVisited = window.analytics.totalVillagesVisited + 1;
        mixpanel.register({
            'totalVillagesVisited': window.analytics.totalVillagesVisited
        });

        mixpanel.people.increment({
            'totalPostsVisited': 1
        });

        mixpanel.register({
            'villageName': params.villageSlug + ' village'
        });

        mixpanel.track('Page Visit', {
            type: 'Post',
            name: params.postId + ' post'
        });
    }
});

FlowRouter.route('/profile/:_id', {
    name: 'Profile',
    action(params, queryParams) {
        BlazeLayout.render('app_body', {profile: 'profile', tabs: 'profile_tabs'});
        $('.sr-playlist').scrollTop(0);
        $('.wrapper').scrollTop(0);
        $('body').scrollTop(0);

        mixpanel.track('Page Visit', {
            type: ( Meteor.userId() == params._id ? 'Own Profile' : 'Other Profile')
        });
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
