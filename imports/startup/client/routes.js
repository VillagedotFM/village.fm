import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';


import '../../ui/layouts/body.js';
import '../../ui/components/profile/profile.js';

// profile, tabs (tabs/profile_tabs), inbox

FlowRouter.route('/post/:_id', {
  name: 'Post',
  action() {
    // BlazeLayout.render('App_body', { main: 'Lists_show_page' });
  },
});

FlowRouter.route('/', {
  name: 'Home',
  action() {
    BlazeLayout.render('app_body', { tabs: 'tabs', inbox: 'inbox' });
  },
});

FlowRouter.route('/:_id', {
  name: 'Profile',
  action() {
    BlazeLayout.render('app_body', { profile: 'profile', tabs: 'profile_tabs' });
  },
});

FlowRouter.notFound = {
  action() {
    // BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
