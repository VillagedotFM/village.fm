import './onboarding-popup.html';
import './events.js';
import './helpers.js';
import './terms/terms.js';
import './policy/policy.js';

Template.onboarding_popup.onCreated(() => {
  appBodyRef.showTermsOrPolicy = new ReactiveVar(null);
});
