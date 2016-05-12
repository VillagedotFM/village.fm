import { Template } from 'meteor/templating';

import './inbox.html';


Template.inbox.helpers({
  create: function(){

  },
  rendered: function(){

  },
  destroyed: function(){

  },
});

Template.inbox.events({
  "click .sr-inbox__arrow": function(event, template){
    $('.sr-playlist__item--inbox').toggle();
    $('.sr-inbox__arrow').toggleClass('fa-caret-up');
  }
});
