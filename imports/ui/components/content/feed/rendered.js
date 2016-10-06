Template.feed.rendered = () => {

	Tracker.autorun(function(){
		let postOrder = appBodyRef.postOrder.get();
		let order = appBodyRef.displayPosts.get();
		let nowPlaying = appBodyRef.nowPlaying.get();
		let postForm = appBodyRef.showForm.get();
		let notFound = appBodyRef.notFound.get();
		let duplicate = appBodyRef.duplicate.get();

		let profileTab = appBodyRef.profileTab.get();
		let time = appBodyRef.timeFilter.get();

		if(nowPlaying && postOrder && postOrder.length){
			postOrder.forEach(function(post, index){
				if(post._id === nowPlaying._id){
					if(index > appBodyRef.postsLoaded.get() - 3){
						if(appBodyRef.postsLoadedDone.get() && !appBodyRef.allPostsLoadedDone.get()){
							appBodyRef.postsLoadedDone.set(false);
							appBodyRef.postsLoaded.set(appBodyRef.postsLoaded.get() + 20);
						}
					}
				}
			});
		}

		let inPlaylist = null;

		if (nowPlaying) {
			inPlaylist = _.findWhere(order, {_id: nowPlaying._id});
			if (inPlaylist) {
				appBodyRef.notInFeed.set(false);
				if (nowPlaying.type === 'youtube') {
					Meteor.setTimeout(function() {
						let topy = $('#video-' + nowPlaying._id).offset().top + 'px';
						$('#ytplayer').css({top: topy});
						$('#ytplayer').show();
					}, 100);
				}
			} else {
				appBodyRef.notInFeed.set(true);
				if (nowPlaying.type === 'youtube') {
					Meteor.setTimeout(function() {
						let topy2 = $('#video-' + nowPlaying._id).offset().top + 'px';
						$('#ytplayer').css({top: topy2});
						$('#ytplayer').show();
					}, 100);
				}
			}
		}

		if(FlowRouter.current().params.postId && appBodyRef.postsLoadedDone.get()){
			Meteor.setTimeout(function(){
				var el = $('.post#' + FlowRouter.current().params.postId);
				console.log(el.length);
				if(el.length){
					$('html, body').scrollTop(el.position().top - 60);
					appBodyRef.scrollToPost.set(false);
				}
			}, 2000);
    }

	});

	var lastScrollTop = 0;

	/**
	* TODO: We want to attach the scroll event to the .wrapper class
	* and remove bounce on scroll with http://stackoverflow.com/a/21247262.
	* See lines that are commented out
	**/
	
	//$('.wrapper').scroll(function(e) {
	$(window).scroll(function(e) {
		var st = $(this).scrollTop();
		//if($('.wrapper')[0].scrollHeight - $('.wrapper').scrollTop() == $('.wrapper').outerHeight()) {
		if($(window).scrollTop() + $(window).height() == $(document).height()) {
			if (st > lastScrollTop){

				if(appBodyRef.postsLoadedDone.get() && !appBodyRef.allPostsLoadedDone.get()){
					appBodyRef.postsLoadedDone.set(false);
					Tracker.flush();
					window.setTimeout(function(){
						appBodyRef.postsLoaded.set(appBodyRef.postsLoaded.get() + 20);
					}, 100);
				}
			}
		}
		lastScrollTop = st;

				$('.post:not(.skeleton)').each(function(){
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
