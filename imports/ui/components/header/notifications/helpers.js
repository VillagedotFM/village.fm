Template.notifications.helpers({
  newNotifications: function(){
    if(Notifications.find({'isRead': false, 'intendedFor': Meteor.userId()}).count() > 0)
      return 'active'
    return '';
  },
  notifications: function(){
    if(Notifications.find({'intendedFor': Meteor.userId()}).count() > 0)
      return Notifications.find({'intendedFor': Meteor.userId()});
    return false;
  },
  isRead: function() {
    if (this.isRead)
      return '';
    return '--unread';
  },
  howLong: function() {
    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var raw = moment.utc(this.createdAt).fromNow(true);

    if(raw === 'a few seconds' || raw === 'a minute')
      return 'just now';

    var chopped = raw.split(' ');
    var num = parseInt(chopped[0], 10);
    var what = chopped[1];
    if (what === 'minutes') {
      if(num < 5)
        return 'just now';
      return num +'min ago';
    } else if (what === 'hour') {
      return '1h ago';
    }else if (what === 'hours') {
      return num + 'h ago';
    }else if (what === 'day') {
      return 'Yesterday';
    }else if (what === 'month' || what === 'months' || what === 'days') {
      return (moment.utc(this.createdAt).calendar());
    }
  }
});
