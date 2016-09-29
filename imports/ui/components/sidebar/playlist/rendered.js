Template.playlist.rendered = () => {
	var lastScrollTop = 0;

	$('.sr-playlist').scroll(function(e) {
		var st = $(this).scrollTop();
		if ($('.sr-playlist')[0].scrollHeight - $('.sr-playlist').scrollTop() == $('.sr-playlist').outerHeight()) {
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
		lastScrollTop = st
	});
}
