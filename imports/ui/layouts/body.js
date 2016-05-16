import { Posts } from '../../api/posts/posts.js';
import { Villages } from '../../api/villages/villages.js';
import { Template } from 'meteor/templating';
import './body.html';
import '../components/mobile-menu/mobile-menu.js';
import '../components/header/header.js';
import '../components/bottom-player/bottom-player.js';
import '../components/now-playing-popup/now-playing-popup.js';
import '../components/sign-up/sign-up.js';
import '../components/sidebar/sidebar.js';
import '../components/content/content.js';
import '../components/mobile-content/mobile-content.js';

Template.app_body.onCreated(function(){
  window.Villages = Villages; 
});


Template.app_body.helpers({

});

Template.app_body.events({
  "click": function(event, template){
     $('.send-to-friend__list, .sign-up, .invite-dropdown').hide();
  }
});
