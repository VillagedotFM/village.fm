import { Template } from 'meteor/templating';

import './invite.html';


Template.invite.helpers({

});

Template.invite.events({
  "click .send-to-friend__input": function(event, template){
    event.stopPropagation();
    let id = $('.send-to-friend__input').data('id');
    let list = $('.send-to-friend__list[data-id="' + id +'"]');
    list.show();
  },
  "click .send-to-friend__list": function(event, template){
    event.stopPropagation();
  },
  "click .villagers__invite": function(event, template){
    event.stopPropagation();
    $('.invite-dropdown').show();
  },
});
