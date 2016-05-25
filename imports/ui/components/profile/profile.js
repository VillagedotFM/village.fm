import './profile.html';
import './profile-tabs/profile-tabs.js';

Template.profile.onRendered(function() {
  $('.uploaded-item').hide();
  $('.sr-playlist__item--inbox').hide();
  $('.sr-inbox__arrow').removeClass('fa-caret-up');
});

Template.profile.helpers({
  user: function(){
    let id = FlowRouter.getParam('_id');
    let user = _.findWhere(Meteor.users.find().fetch(), {_id: id});
    if (user) {
      return user;
    }
  }
});

Template.profile.events({
});
