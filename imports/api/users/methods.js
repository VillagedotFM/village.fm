import {Meteor} from "meteor/meteor";
import {Roles} from "meteor/alanning:roles";

Meteor.methods({

    fakeUser_create(thumbnail, name, email, category) {

        let user = Accounts.createUser({
            username: email,
            email: email,
            password: 'villageFM1234',
            profile: {
                name: name,
                category: category,
                picture: thumbnail
            }
        });

        if (!user) {
            console.error("createFakeUser - email: " + email);
            return null;
        } else {
            Roles.addUsersToRoles(user, ['fakeUser']);
            return user;
        }
    },

    fakeUser_remove (userId) {
        Meteor.users.remove({_id: userId});
    },
});