import { Template } from 'meteor/templating';

import './sign-up.html';


Template.sign_up.helpers({
});

Template.sign_up.events({
  "click .sign-up": function(event, template){
     event.stopPropagation();
  }
});
