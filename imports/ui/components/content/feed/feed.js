import { Template } from 'meteor/templating';

import './feed.html';


Template.feed.helpers({
});

Template.feed.events({
  "click .post__comments": function(event, template){
    var id = $('.post__comments').data('id');
    console.log(id);
    var comment = $('.comments-block[data-id="' + id +'"]');
    var send = $('.send-to-friend[data-id="' + id +'"]');

    $('.post__send').removeClass('active');
    $('.post__comments').addClass('active');
    send.hide();
    comment.show();
  },
  "click .post__send": function(event, template){
    var id = $('.post__send').data('id');
    var comment = $('.comments-block[data-id="' + id +'"]');
    var send = $('.send-to-friend[data-id="' + id +'"]');

    $('.post__comments').removeClass('active');
    $('.post__send').addClass('active');
    comment.hide();
    send.show();
  },
});
