import { Posts } from '../../api/posts/posts.js';
import { Villages } from '../../api/villages/villages.js';

import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';

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
  this.subscribe('villages.all');
  this.subscribe('posts.all');
  window.Villages = Villages;
  window.Posts = Posts;
});

Template.app_body.onRendered(function() {
  $('.uploaded-item').hide();
  $('.sr-playlist__item--inbox').hide();
  $('.sr-inbox__arrow').removeClass('fa-caret-up');
});


Template.app_body.helpers({

});

Template.app_body.events({
  "click": function(event, template){
     $('.send-to-friend__list, .sign-up, .invite-dropdown').hide();
  }
});
