import { Profiles } from '/imports/api/profiles/profiles.js';

Template.start_village.events({
  'click .vf-modal.active': () => {
    if($(event.target).is('.vf-modal.active')) {
      startVillageRef.step.set(null);
    }
  },
  'click .start-village__signup .vf-btn': () => {
    Meteor.loginWithFacebook({requestPermissions: ['email', 'public_profile']}, function(err){
      if (err) {
        throw new Meteor.Error("Facebook login failed");
      } else {

        var user = Meteor.user();
        // FIX: Find another way how to know that a new user is logging in
        if(user.profile.newUser){
          mixpanel.alias(Meteor.userId());
          mixpanel.track('Signed Up', {
            service: 'facebook'
            // TODO: FB friends properties
          });
          Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.newUser": false}});
        } else {
          mixpanel.identify(Meteor.userId());
          mixpanel.track('Signed In', {
            service: 'facebook'
            // TODO: FB friends properties
          });
        }

        const profile = Profiles.findOne({createdBy: user._id });

        if(profile){
          mixpanel.people.set({
            '$email': Meteor.user().services.facebook.email,
            '$first_name': profile.firstName,
            '$last_name': profile.lastName,
            '$name': profile.firstName + " " + profile.lastName,
            'gender': profile.gender
            // 'minAge': profile.ageRange.min,
            // 'maxAge': profile.ageRange.max
          });
        }



        console.log("Logged In!");
        startVillageRef.step.set('details');
      }
    });
  },
  'submit .start-village__details__form': () => {
    let villageName = $('.start-village__details__group-name').val().trim();
    let villageDescription = $('.start-village__details__group-description').val().trim();
    if(villageName.length === 0) {
      startVillageRef.validName.set(false);
    } else {
      startVillageRef.validName.set(true);

      Meteor.call("createVillage", villageName, villageDescription, (err, data) => {
        if (err) {
          console.error("Error creating Village: ", err);
        }
        else {
          startVillageRef.newVillage.set(data);
          startVillageRef.step.set('finish');
        }
      });
    }
    return false;
  },
  'keyup .start-village__details__group-name': (event) => {
    let villageName = event.target.value.trim();
    if(villageName.length === 0) {
      startVillageRef.validName.set(false);
    } else {
      startVillageRef.validName.set(true);
    }
  },
  'click .start-village__finish__copy': (event) => {
    $('input[name=village-link]').select();
    document.execCommand("copy");
  },
  'click .vf-social-icon': (event) => {
    window.open($(event.currentTarget).data('href'), 'Title', 'width=800,height=500');
  },
})
