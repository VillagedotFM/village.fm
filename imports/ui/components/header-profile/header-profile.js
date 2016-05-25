import { Template } from 'meteor/templating';

import './header-profile.html';


Template.header_profile.helpers({
});

Template.header_profile.events({
  "click .header-profile__thumb": function(event, template){
    event.stopPropagation();
    $('.sign-up').show();
  }
});
