import { Template } from 'meteor/templating';

import './invite.html';


Template.invite.helpers({
  village() {
    return Villages.findOne({});
  },
  firstUsers() {
    return Villages.findOne({}, {fields: {users: 1}, limit: 8}).users;
  },
  dottedUsers() {
    return Villages.findOne({}, {fields: {users: 1}, skip: 8}).users; //Dropdown on hover of circle with ellipsis
  }
});

Template.invite.events({
  //TODO: instead of show, use a reactive-var to render
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
