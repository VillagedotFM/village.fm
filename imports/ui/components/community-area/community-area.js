import './community-area.html';
import './events.js';
import './helpers.js';
import './community-area-villagers/community-area-villagers.js';
import './community-area-categories/community-area-categories.js';


Template.community_area.onCreated(function() {
  communityAreaRef = this;

  communityAreaRef.inviteButtonActive = new ReactiveVar(false);
  communityAreaRef.villageLinkCopied = new ReactiveVar(false);
  communityAreaRef.joined = new ReactiveVar(false);
});
