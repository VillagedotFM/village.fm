import './profile.html';
import './profile-tabs/profile-tabs.js';

Template.profile.onRendered(function() {
  //TODO: reactive-var instead of hide
  $('.uploaded-item').hide();
  $('.sr-playlist__item--inbox').hide();
  $('.sr-inbox__arrow').removeClass('fa-caret-up');
});

Template.profile.helpers({
  user: function(){
    let id = FlowRouter.getParam('_id');  //Grab id from url and ensure it's a real user
    let user = _.findWhere(Meteor.users.find().fetch(), {_id: id});
    if (user) {
      return user;
    }
  }
});

Template.profile.events({
});
