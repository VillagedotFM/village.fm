Template.community_area_edit.events({
  'click .vf-community-area__edit-village.active': () => {
    if($(event.target).is('.vf-community-area__edit-village.active')) {
      communityAreaEditRef.tab.set(null);
    }
  },
  'click .vf-community-area__edit-village__tabs li': (event) => {
    communityAreaEditRef.tab.set(event.target.dataset.tab)
  },
  'keyup .vf-community-area__edit-village__group-name': (event) => {
    let villageName = event.target.value.trim();
    if(villageName.length === 0) {
      communityAreaEditRef.validName.set(false);
    } else {
      communityAreaEditRef.validName.set(true);
    }
  },
  'submit .vf-community-area__edit-village__form': () => {
    let villageName = $('.vf-community-area__edit-village__group-name').val().trim();
    let changes = {};
    let cats = [];

    if ($("input[name=category-1]").val() !== '') {
      cats.push({name: $("input[name=category-1]").val(), posts: []});
    }
    if ($("input[name=category-2]").val() !== '') {
      cats.push({name: $("input[name=category-2]").val(), posts: []});
    }
    if ($("input[name=category-3]").val() !== '') {
      cats.push({name: $("input[name=category-3]").val(), posts: []});
    }
    if ($("input[name=category-4]").val() !== '') {
      cats.push({name: $("input[name=category-4]").val(), posts: []});
    }
    if ($("input[name=category-5]").val() !== '') {
      cats.push({name: $("input[name=category-5]").val(), posts: []});
    }
    if ($("input[name=category-6]").val() !== '') {
      cats.push({name: $("input[name=category-6]").val(), posts: []});
    }
    if ($("input[name=category-7]").val() !== '') {
      cats.push({name: $("input[name=category-7]").val(), posts: []});
    }
    if ($("input[name=category-8]").val() !== '') {
      cats.push({name: $("input[name=category-8]").val(), posts: []});
    }

    if(villageName.length === 0) {
      communityAreaEditRef.validName.set(false);
    } else {
      communityAreaEditRef.validName.set(true);

      changes = {
        name: $("input[name=group-name]").val(),
        description: $("textarea[name=group-description]").val(),
        categories: cats,
        facebook: $("input[name=social-link-facebook]").val(),
        youtube: $("input[name=social-link-youtube]").val(),
        website: $("input[name=social-link-website]").val(),
        twitter: $("input[name=social-link-twitter]").val()
      };
    }

    const villageSlug = FlowRouter.getParam('villageSlug');
    let village;

    if (villageSlug) {    //Handle main village (no slug)
      village = Villages.findOne({'friendlySlugs.slug.base': villageSlug});
    } else {
      village = Villages.findOne({'friendlySlugs.slug.base': "main"});
    }

    if (village) {
      Meteor.call('editVillage', village._id, changes, function(err, data) {
        if (err) {
          console.log(err);
        } else {
          console.log("Edited Village!");
          communityAreaEditRef.tab.set(null);
          $("input[name=category-1]").val('');
          $("input[name=category-2]").val('');
          $("input[name=category-3]").val('');
          $("input[name=category-4]").val('');
          $("input[name=category-5]").val('');
          $("input[name=category-6]").val('');
          $("input[name=category-7]").val('');
          $("input[name=category-8]").val('');
        }
      });
    }

    return false;
  },
})
