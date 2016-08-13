import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import  moment  from 'moment';

import { Notifications } from './notifications.js';

Meteor.methods({
  readNotification:function(notificationId){

    Notifications.update({
        _id: notificationId,
        },{
        $set: {
          isRead: true
        }
    });
  },
  allRead: function(){
    Notifications.update({
        intendedFor: Meteor.userId(),
        },{
        $set: {
          isRead: true
        }},
        {multi:true
    });
  },
});
