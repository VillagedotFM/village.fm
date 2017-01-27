import './community-area-villagers.html';
import './events.js';
import './helpers.js';


Template.community_area_villagers.onCreated(function() {
  communityAreaVillagersRef = this;

  communityAreaVillagersRef.villagersModalActive = new ReactiveVar(false);
});


Template.community_area_villagers.onRendered(function() {
  $('.vf-community-area__villagers .vf-modal__content').perfectScrollbar({'suppressScrollX': true });
});
