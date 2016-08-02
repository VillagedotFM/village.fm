import {Meteor} from "meteor/meteor";
import "./fake-users.html";

let selectedFakeUser = new ReactiveVar();

Template.fakeUsers.onCreated(function () {
    Meteor.subscribe("users.allFakeUsers");
});

Template.fakeUsers.events({
    "click #parseFile": function (e) {
        var f = document.getElementById('fileInput').files[0];
        readFile(f, function (content) {
            parseFile(content);
        });
    },

    'click #deleteFakeUserButton': function (event, template) {

        let selectedFakeUserId = $(event.target).data("fakeuserid");

        let fakeUser = Meteor.users.findOne({_id: selectedFakeUserId});

        if (fakeUser) {
            selectedFakeUser.set(fakeUser);
        }
        else {
            selectedFakeUser.set(null);
        }
    },

    'click #confirmDeleteFakeUserButton': function (event, template) {
        if (selectedFakeUser.get()) {
            Meteor.call("fakeUser_remove", selectedFakeUser.get()._id, (err, data) => {
                if (err) {
                    console.error("Error deleting fake user: ", err);
                }
                else {
                    console.log("Fake user removed");
                    $("#deleteFakeUserModal").modal('hide');
                }
            });
        }
    }
});

Template.fakeUsers.helpers({
    fakeUsers: function () {
        return Meteor.users.find({
            roles: 'fakeUser'
        }).fetch();
    },

    selectedFakeUser: function () {
        return selectedFakeUser.get();
    }
});


let readFile = (f, onLoadCallback) => {
    //When the file is loaded the callback is called with the contents as a string
    let reader = new FileReader();
    reader.onload = function (e) {
        let contents = e.target.result;
        onLoadCallback(contents);
    };
    reader.readAsText(f);
};

let parseFile = (content) => {
    let lines = content.split(/\r\n|\n/);
    if (lines && lines.length > 0) {
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i];
            let line_parts = line.split('\t');

            if (line_parts && line_parts.length > 4) {
                let email = line_parts[0];
                let firstName = line_parts[1];
                let lastNameInitial = line_parts[2];
                let thumbnail = line_parts[3];
                let category = line_parts[4];


                Meteor.call("fakeUser_create", thumbnail, firstName, lastNameInitial, email, category, function (err, data) {
                    if (err) {
                        if (err.reason.indexOf("Username already exists") > -1) {
                            console.error("Fake user " + email + " already exists");
                        }
                        else {
                            console.error("Error creating fake user: ", err);
                        }
                    }
                    else {
                        console.log("Fake user " + email + " created.");
                    }
                });
            }
        }
    }
};