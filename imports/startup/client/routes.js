import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';


import '../../ui/layouts/body.js';
import '../../ui/pages/hello/hello.js';
import '../../ui/pages/info/info.js';

FlowRouter.route('/post/:_id', {
  name: 'Post',
  action() {
    // BlazeLayout.render('App_body', { main: 'Lists_show_page' });
  },
});

FlowRouter.route('/', {
  name: 'Home',
  action() {
    BlazeLayout.render('app-body', { content: 'hello' });
  },
});

FlowRouter.route('/:_id', {
  name: 'Profile',
  action() {
    BlazeLayout.render('app-body', { content: 'info' });
  },
});

FlowRouter.notFound = {
  action() {
    // BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
