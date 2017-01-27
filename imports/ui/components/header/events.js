import { Email } from 'meteor/email';

Template.header.events({
  'click .vf-header__menu-btn': () => {
    appBodyRef.showSideMenu.set(!appBodyRef.showSideMenu.get());
  },
  "click .vf-header__log-in": function(event, template){
    event.stopPropagation();
    appBodyRef.signUp.set(true);

    mixpanel.track('Clicked Sign In Button');
  },
  'click .tune-in-close': function(event, template) {
    appBodyRef.tuneInBanner.set(false);
  },
  'click .tune-in-link': function(event, template) {
    mixpanel.track('Clicked Buy Tickets Link');
  }
});
