mixpanel.init(Meteor.settings.public.analyticsSettings.Mixpanel.key, {'loaded':function(mixpanel) {
    var distinct_id = mixpanel.get_distinct_id();
}});

console.log(Meteor.userId());

if(!Meteor.userId()){
	var anonymousUserId = localStorage.getItem('anonymousUserId');
	if (!anonymousUserId){
	  anonymousUserId = 'anonymous' + Math.round(Math.random() * 1000000000);
	  anonymousUserId = anonymousUserId.toString();
	  localStorage.setItem('anonymousUserId', anonymousUserId);
	}
	mixpanel.identify(anonymousUserId);
	mixpanel.people.set_once('$first_name', anonymousUserId);
	mixpanel.people.set_once('anonymous', true);
}