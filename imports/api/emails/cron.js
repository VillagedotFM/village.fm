console.log('Time now ' + new Date());
const t = new Date();
t.setSeconds(t.getSeconds() + 10);
console.log('Setting job to future in 10 seconds ' + t);

SyncedCron.add({
  name: 'aggregateNotifications',
  schedule: function (parser) {
  	// Every 12 hours 
    return parser.text('every 12 hours');
  },
  job: function () {
  	const time = new Date(Date.now() - 1000 * 3600 * 12);

  	notifications = Notifications.aggregate([
  		// Match the documents to every song downloaded in last 6 hours
      { "$match": {
        "date": { "$gte": time },
      }},
  	]);
  }
});

SyncedCron.start();