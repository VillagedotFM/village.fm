import { Template } from 'meteor/templating';

import './upload.html';



Template.upload.helpers({

});

Template.upload.events({
  "click .uploaded-item__cancel": function(event, template){
    $('.uploaded-item').hide();
  }
});
