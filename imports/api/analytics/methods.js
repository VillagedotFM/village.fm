import { Meteor } from 'meteor/meteor';
import Mixpanel from 'mixpanel';

var mixpanel = Mixpanel.init(Meteor.settings.public.analyticsSettings.Mixpanel.key);

// alias() is used when user signs up  
export function alias() {
	if(Meteor.userId()){
		mixpanel.alias(Meteor.userId());
	}
	
	return 1;
}

//identify() is used when user logs in 
export function identify() {
	if(Meteor.userId()){
		mixpanel.identify(Meteor.userId());
	}
	
	return 1;
}

// increment is used to increment profile properties
export function peopleIncrement(properties) {
	if(Meteor.userId()){
		mixpanel.identify(Meteor.userId());
		mixpanel.people.increment(properties);
	}

	return 1;
}

// set() is used to set profile properties
export function peopleSet(properties) {
	if(Meteor.userId()){
		mixpanel.identify(Meteor.userId());
		mixpanel.people.set(properties);
	}

	return 1;
}

// register is used to set super properties
export function register(properties){
	//It's better to use register_once because it doesn't set the super property again and again 
	mixpanel.register_once(properties);

	return 1;
}

// track() is used to track events
export function track(name, properties){
	mixpanel.track(name, properties);

	return 1;
}

Meteor.methods({
	'analytics.alias': alias,
	'analytics.identify': identify,
	'analytics.people.increment': peopleIncrement,
	'analytics.people.set': peopleSet,
	'analytics.register': register,
	'analytics.track': track
});