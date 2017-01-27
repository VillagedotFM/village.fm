import './profile.html';
import './helpers.js';
import './events.js';
import './profile-tabs/profile-tabs.js';

Template.profile.onRendered(function() {
  //TODO: reactive-var instead of hide
  $('.uploaded-item').hide();
  $('.sr-playlist__item--inbox').hide();
  $('.sr-inbox__arrow').removeClass('fa-caret-up');

  this.autorun(function(){
    Meteor.setTimeout(function() {
      var lastListensBlock = $('.last-listens__inner');
      
      if(lastListensBlock.length !== 0){
        var lastListensWidth, lastListensItem;

        lastListensItem = $('.last-listens__item');
        lastListensWidth = lastListensItem.length * lastListensItem.outerWidth();
        lastListensBlock.css('width', lastListensWidth + "px");

        $('.last-listens__wrap').perfectScrollbar({'suppressScrollY': true });
      }
    }, 1000);
  });

  // Stick profile to the top on scroll
  $(window).scroll(function() {
    if ($(window).scrollTop() > $('.main').offset().top - 60) {
      $('.profile').addClass('profile--fixed');
    }
    else {
      $('.profile').removeClass('profile--fixed');
    }
  });
});
