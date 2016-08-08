import { Posts } from '../../api/posts/posts.js';
import { Villages } from '../../api/villages/villages.js';
import { Notifications } from '../../api/notifications/notifications.js';
import { Comments } from '../../api/comments/comments.js';
import { Inbox } from '../../api/inbox/inbox.js';
import { Emails } from '../../api/emails/emails.js'; 

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import { SEO } from '../../api/seo/seo.js';
import  moment  from 'moment';
import SC from '../../../public/js/sc3.js';
import  perfectScrollbar  from 'meteor/keepnox:perfect-scrollbar';

import './body.html';
import '../components/mobile-menu/mobile-menu.js';
import '../components/header/header.js';
import '../components/profile/profile.js';
import '../components/bottom-player/bottom-player.js';
import '../components/now-playing-popup/now-playing-popup.js';
import '../components/sign-up/sign-up.js';
import '../components/sidebar/sidebar.js';
import '../components/content/content.js';
import '../components/mobile-content/mobile-content.js';


Template.app_body.onCreated(function appBodyOnCreated() {
  //TODO: remove (for testing purposes only)
  this.autorun(() => {
    this.subscribe('posts.all', {onReady: function() {
      if (FlowRouter.current().params.postId) {
        const _id = FlowRouter.getParam('postId');
        const post = Posts.findOne({_id});
        SEO.set({
          title: post.artist+' - '+post.title,
          description: 'Check out this song on Village.fm',
          meta: {
            'property="og:image"': post.thumbnail,
            'name="twitter:image"': post.thumbnail,
            'property="og:type"': 'website',
            'property="og:site_name"': 'Village.fm',
            'name="twitter:card"': 'summary',
          }
        });
      } 
    }});
    this.subscribe('villages.all');
    this.subscribe('comments.all');
    this.subscribe('inbox.all');
    this.subscribe('notifications.all');
  });

  window.Villages = Villages;
  window.Posts = Posts;
  window.Comments = Comments;
  window.Inbox = Inbox;
  window.Notifications = Notifications;

  //Set up reactive-vars
  appBodyRef = this;
  appBodyRef.nowPlaying = new ReactiveVar(null);    //1 currently playing post
  appBodyRef.displayPosts = new ReactiveVar(null);  //1+ posts shown in the feed
  appBodyRef.videosReady = new ReactiveArray();  //1+ posts ready
  appBodyRef.postOrder = new ReactiveVar(null);    //1+ posts in master order (no pagination)

  appBodyRef.prevPost = new ReactiveVar(null);
  appBodyRef.nextPost = new ReactiveVar(null);

  appBodyRef.bottomHits = new ReactiveVar(0);       //Keep track of how many times a user scrolls to the bottom

  appBodyRef.replyTo = new ReactiveVar(null);       //Comment to reply to

  appBodyRef.inboxOpen = new ReactiveVar(false);

  //Tab states
  appBodyRef.timeFilter = new ReactiveVar('week');
  appBodyRef.profileTab = new ReactiveVar('upvotes');

  appBodyRef.state = new ReactiveVar(-1);           //Current post state
  appBodyRef.completed = new ReactiveVar("0:00");   //Duration completed for current song

  //Soundcloud widget controller
  appBodyRef.scplayer = new ReactiveVar(null);
});

Template.app_body.onRendered(function() {
  //TODO: use reactive-var instead of show/hide
  Tags.set('taggedUsers', []);
  $('.uploaded-item').hide();
  $('.sr-playlist__item--inbox').hide();
  $('.sr-inbox__arrow').removeClass('fa-caret-up');
});

Template.app_body.events({
  //TODO: use reactive-var instead of show/hide
  "click": function(event, template){
     $('.send-to-friend__list, .sign-up, .invite-dropdown').hide();
  }
});