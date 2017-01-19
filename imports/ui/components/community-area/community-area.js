import './community-area.html';
import './events.js';
import './helpers.js';
import './community-area-villagers/community-area-villagers.js';
import './community-area-categories/community-area-categories.js';
import './community-area-edit/community-area-edit.js';


Template.community_area.onCreated(function() {
  communityAreaRef = this;

  communityAreaRef.inviteButtonActive = new ReactiveVar(false);
  communityAreaRef.villageLinkCopied = new ReactiveVar(false);
  communityAreaRef.joined = new ReactiveVar(false);
  communityAreaRef.category = new ReactiveVar('Most Upvoted');
});


Template.community_area.onRendered(function communityAreaOnRendered() {
  Tracker.autorun(function(){
    let category = communityAreaRef.category.get();

    console.log(category);
  });
});
