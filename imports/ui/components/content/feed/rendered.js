Template.feed.rendered = () => {

	$('.wrapper').scroll(function() {
        if(isElementInViewport($('.post'))){
        	mixpanel.track('Scrolled Past Post');

        	const totalPostsInViewport = mixpanel.get_property('totalPostsInViewport');
	        mixpanel.register({
	            'totalPostsInViewport': totalPostsInViewport + 1
	        });

	        mixpanel.people.increment({
	            'totalPostsInViewport': 1
	        });
        }
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
