Template.feed.rendered = () => {

	$('.wrapper').scroll(function(e) {
        $('.post').each(function(){
            if(isElementInViewport($(this))){
                const user = Meteor.user();
                if(user && !user.profile.postsViewed){
                    user.profile.postsViewed = [];
                }

                if(user && user.profile.postsViewed.indexOf($(this).attr('id')) < 0){
                    Meteor.users.update({_id: Meteor.userId()}, { $addToSet: { 'profile.postsViewed': $(this).attr('id') }});

                    mixpanel.track('Unique Post Viewed');
                    mixpanel.register({
                        'totalUniquePostViewed': user.profile.postsViewed.length + 1
                    });

                    mixpanel.people.set({
                        'totalUniquePostViewed': user.profile.postsViewed.length + 1
                    });
                }
            }
        });
    });
};

function isElementInViewport(el) {
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}
