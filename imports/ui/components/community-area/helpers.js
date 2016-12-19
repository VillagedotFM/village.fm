Template.community_area.helpers({
  'inviteButtonActive': () => {
    return communityAreaRef.inviteButtonActive.get();
  },
  'villageLinkCopied': () => {
    return communityAreaRef.villageLinkCopied.get();
  },
  'joined': () => {
    return communityAreaRef.joined.get();
  }
})
