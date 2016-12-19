import './community-area-edit.html';
import './events.js';
import './helpers.js';

Template.community_area_edit.onCreated(function() {
  communityAreaEditRef = this;

  communityAreaEditRef.tab = new ReactiveVar(null);
  communityAreaEditRef.validName = new ReactiveVar(true);
});
