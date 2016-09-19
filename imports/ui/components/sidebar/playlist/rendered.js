Template.playlist.rendered = () => {
	$('.sr-playlist').scroll(function(e) {
		if ($('.sr-playlist')[0].scrollHeight - $('.sr-playlist').scrollTop() == $('.sr-playlist').outerHeight()) {
			appBodyRef.postsLoaded.set(appBodyRef.postsLoaded.get() + 8);
		}
	});
}
