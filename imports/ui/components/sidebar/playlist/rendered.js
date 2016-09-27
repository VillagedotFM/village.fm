Template.playlist.rendered = () => {
	$('.sr-playlist').scroll(function(e) {
		if ($('.sr-playlist')[0].scrollHeight - $('.sr-playlist').scrollTop() == $('.sr-playlist').outerHeight()) {
			if(appBodyRef.postsLoadedDone.get()){
				appBodyRef.postsLoadedDone.set(false);
				appBodyRef.postsLoaded.set(appBodyRef.postsLoaded.get() + 8);
			}
		}
	});
}
