Template.community_area.events({
  'click .vf-community-area__invite > button': (event) => {
    communityAreaRef.inviteButtonActive.set(!communityAreaRef.inviteButtonActive.get());
    communityAreaRef.villageLinkCopied.set(false);
  },
  'click .vf-community-area__copy-link': (event) => {
    var $temp = $("<input>");
    $("body").append($temp);
    let base = window.location.href;
    $temp.val(base).select();
    document.execCommand("copy");
    $temp.remove();

    communityAreaRef.villageLinkCopied.set(true);
  },
  'click .vf-community-area__join': function(event) {
    Meteor.call('joinVillage', this._id, function(err, data) {
      if (err) {
        console.log(err);
      } else {
        console.log("Joined Village!");
      }
    });
    communityAreaRef.joined.set(true);
  },
  'click .vf-community-area__edit': (event) => {
    communityAreaEditRef.tab.set('general');
  },
  'click .vf-community-area__add-new-social-link': (event) => {
    communityAreaEditRef.tab.set('social');
  }
})
