import { Posts } from '../../api/posts/posts.js';
import { Villages } from '../../api/villages/villages.js';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import  moment  from 'moment';
import SC from 'soundcloud';

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
  this.subscribe('villages.all');
  this.subscribe('posts.all');
  window.Villages = Villages;
  window.Posts = Posts;

  //Set up reactive-vars
  appBodyRef = this;
  appBodyRef.nowPlaying = new ReactiveVar(null);
  appBodyRef.videoReady = new ReactiveVar(false);
  appBodyRef.postOrder = new ReactiveVar(false);
  appBodyRef.timeFilter = new ReactiveVar('week');
  appBodyRef.profileTab = new ReactiveVar('upvotes');
  appBodyRef.state = new ReactiveVar(-1);
  appBodyRef.completed = new ReactiveVar("0:00");
});

Template.app_body.onRendered(function() {
  SC.initialize({
    client_id: Meteor.settings.public.soundcloud.client_id
  });

  //TODO: use reactive-var instead of show/hide
  $('.uploaded-item').hide();
  $('.sr-playlist__item--inbox').hide();
  $('.sr-inbox__arrow').removeClass('fa-caret-up');
});


Template.app_body.helpers({

});

Template.app_body.events({
  //TODO: use reactive-var instead of show/hide
  "click": function(event, template){
     $('.send-to-friend__list, .sign-up, .invite-dropdown').hide();
  }
});
