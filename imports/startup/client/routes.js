import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';


import '../../ui/layouts/body.js';
import '../../ui/components/profile/profile.js';

// options: profile, tabs (tabs/profile_tabs), inbox, upload, invite

FlowRouter.route('/post/:_id', {  //Permalink
  name: 'Post',
  action() {
    //TODO: render single post (in what village?)
  },
});

FlowRouter.route('/', {
  name: 'Home',
  action() {
    BlazeLayout.render('app_body', { tabs: 'tabs', inbox: 'inbox', upload: 'upload', invite: 'invite' });
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
    //TODO: add template for not found
  },
};
