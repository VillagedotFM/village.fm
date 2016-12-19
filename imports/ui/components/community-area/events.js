Template.community_area.events({
  'click .vf-community-area__invite > button': (event) => {
    communityAreaRef.inviteButtonActive.set(!communityAreaRef.inviteButtonActive.get());
    communityAreaRef.villageLinkCopied.set(false);
  },
  'click .vf-community-area__copy-link': (event) => {
    communityAreaRef.villageLinkCopied.set(true);
  },
  'click .vf-community-area__join': (event) => {
    communityAreaRef.joined.set(true);
  }
})
