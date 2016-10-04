import { Posts } from '../../api/posts/posts.js';
import { Profiles } from '../../api/profiles/profiles.js';
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
import { SC } from '../../../public/js/sc3.js';
import  perfectScrollbar  from 'meteor/keepnox:perfect-scrollbar';

import './body.html';
import './helpers.js';
import './events.js';
import '../components/mobile-menu/mobile-menu.js';
import '../components/header/header.js';
import '../components/profile/profile.js';
import '../components/bottom-player/bottom-player.js';
import '../components/now-playing-popup/now-playing-popup.js';
import '../components/sign-up/sign-up.js';
import '../components/sidebar/sidebar.js';
import '../components/content/content.js';
import '../components/mobile-content/mobile-content.js';
import '../components/terms-and-policy/terms.js';
import '../components/terms-and-policy/policy.js';


Template.app_body.onCreated(function appBodyOnCreated() {

  //configure spinner
  Meteor.Spinner.options = {
    lines: 13, // The number of lines to draw
    length: 8, // The length of each line
    width: 3, // The line thickness
    radius: 10, // The radius of the inner circle
    corners: 0.7, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: '#fff', // #rgb or #rrggbb
    speed: 1, // Rounds per second
    trail: 60, // Afterglow percentage
    shadow: true, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: 'auto', // Top position relative to parent in px
    left: 'auto' // Left position relative to parent in px
  };

  this.getVillageSlug = () => FlowRouter.getParam('villageSlug') || 'main';
  this.autorun(() => {
    this.subscribe('posts.all', { villageSlug: this.getVillageSlug() }, {onReady: function() {
      appBodyRef.postsLoadedDone.set(true);

      if (FlowRouter.current().params.postId) {
        const _id = FlowRouter.getParam('postId');
        const post = Posts.findOne({_id});
        SEO.set({
          title: post.artist+' - '+post.title,
          description: 'Check out this song on Village.fm',
          meta: {
            'property="og:image"': post.thumbnail,
            'name="twitter:image"': post.thumbnail,
            'property="og:image:width"': '475',
            'property="og:image:height"': '250',
            'property="og:type"': 'website',
            'property="og:site_name"': 'Village.fm',
            'name="twitter:card"': 'summary',
          }
        });
      }
    }});
    this.subscribe('villages.all', { slug: this.getVillageSlug() }, {onReady: function() {
      if ((FlowRouter.current().params.villageSlug) && (!FlowRouter.current().params.postId)) {
        const villageSlug = FlowRouter.getParam('villageSlug');
        if (villageSlug !== 'all') {
          const village = Villages.findOne({'friendlySlugs.slug.base': villageSlug});
          console.log(village);
          SEO.set({
            title: village.name + ' Village',
            description: "The Best Music chosen by the "+ village.name +" Community",
            meta: {
              'property="og:image"': 'http://village.fm/images/img-topbar-' + villageSlug + '@3x.png',
              'property="og:image:width"': '1440',
              'property="og:image:height"': '180',
              'name="twitter:image"': 'http://village.fm/images/img-topbar-' + villageSlug + '@3x.png',
              'property="og:type"': 'website',
              'property="og:site_name"': 'Village.fm',
              'name="twitter:card"': 'summary',
            }
          });
        }
      }
    }});
    this.subscribe('comments.all');
    this.subscribe('profiles.self');
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

  appBodyRef.upvotedSuccess = new ReactiveVar(null);
  appBodyRef.upvotedError = new ReactiveVar(null);

  appBodyRef.signUp = new ReactiveVar(null);
  appBodyRef.guestAction = new ReactiveVar(null);
  appBodyRef.showTermsOrPolicy = new ReactiveVar(null);

  appBodyRef.postSuccess = new ReactiveVar(null);
  appBodyRef.showForm = new ReactiveVar(false);
  appBodyRef.notFound = new ReactiveVar(false);
  appBodyRef.duplicate = new ReactiveVar(null);

  appBodyRef.nowPlaying = new ReactiveVar(null);    //1 currently playing post

  appBodyRef.displayPosts = new ReactiveVar(null);  //1+ posts shown in the feed
  appBodyRef.postsLoaded = new ReactiveVar(20);
  appBodyRef.postsLoadedDone = new ReactiveVar(false);
  appBodyRef.allPostsLoadedDone = new ReactiveVar(false);
  appBodyRef.videosReady = new ReactiveArray();  //1+ posts ready
  appBodyRef.postOrder = new ReactiveVar(null);    //1+ posts in master order (no pagination)\

  appBodyRef.notInFeed = new ReactiveVar(null);

  // appBodyRef.loadIframe = new ReactiveArray();    //1+ posts to load

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
  appBodyRef.playing = new ReactiveVar(false);   //Duration completed for current song

  //Soundcloud widget controller
  appBodyRef.scplayer = new ReactiveVar(null);

  appBodyRef.mobile = new ReactiveVar(false);       //Mobile indicator
});

Template.app_body.onRendered(function() {
  $('.sr-playlist, .onboarding-popup__terms, .onboarding-popup__policy').perfectScrollbar();
  $('.wrapper').scrollTop(0);
  $('body').scrollTop(0);
  $('.sr-playlist').scrollTop(0);


  // Tracker.autorun(function(comp) {
  //   let order = appBodyRef.postOrder.get();
  //   if (order[0]) {
  //     appBodyRef.nowPlaying.set(order[0]);
  //     comp.stop();
  //   }
  // });
  //
  // Tracker.autorun(function(){
  //   let order = appBodyRef.postOrder.get();
  //
  //   if (appBodyRef.nowPlaying.get() !== null) {
  //     let indexes = $.map(order, function(post, index) {
  //       if(post._id === appBodyRef.nowPlaying.get()._id) {
  //         return index;
  //       }
  //     });
  //     if (typeof indexes[0] === 'undefined') {
  //       appBodyRef.nowPlaying.set(order[0]);
  //     }
  //   }
  // });


  //TODO: use reactive-var instead of show/hide
  Tags.set('taggedUsers', []);
  $('.ntf-dropdown').hide();
  $('.notification-container').show();
  $('.uploaded-item').hide();
  $('.sr-playlist__item--inbox').hide();
  $('.sr-inbox__arrow').removeClass('fa-caret-up');

  if(window.matchMedia("(max-width: 767px)").matches) {
    $('.us-mobile').hide();
    $('.container').hide();
    $('.sidebar').show();
    hideMenu();

    appBodyRef.mobile.set(true);
  }
});
