mixpanel.init(Meteor.settings.public.analyticsSettings.Mixpanel.key, {'loaded':function(mixpanel) {
    var distinct_id = mixpanel.get_distinct_id()}
});