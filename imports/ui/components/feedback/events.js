Template.feedback.events({
  'submit .vf-feedback__form': (event, template) => {
    event.preventDefault();
    const feedback = $('.vf-feedback__input').val().trim();
    if(feedback !== "") {
      let user = Meteor.user();
      Meteor.call('submitFeedbackForm', user.services.facebook.email, user.profile.name, feedback);
      appBodyRef.showFeedbackForm.set(false);
      $('.vf-feedback__input').val("");
    }
  },
  'click .vf-modal.active': () => {
    if($(event.target).is('.vf-modal.active')) {
      appBodyRef.showFeedbackForm.set(false);
    }
  },
})
