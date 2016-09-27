Template.playlist.rendered = () => {
	$('.sr-playlist').scroll(function(e) {
		if ($('.sr-playlist')[0].scrollHeight - $('.sr-playlist').scrollTop() == $('.sr-playlist').outerHeight()) {
			if(appBodyRef.postsLoadedDone.get()){
				appBodyRef.postsLoadedDone.set(false);
				Tracker.flush();
				window.setTimeout(function(){
					appBodyRef.postsLoaded.set(appBodyRef.postsLoaded.get() + 8);
				}, 100);
			}
		}
	});
}
