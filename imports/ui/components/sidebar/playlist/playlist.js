import './playlist.html';
import './events.js';
import './helpers.js';

Template.playlist.helpers({
	selectedSong: function (_id) {
		// Highlight current permalink song
		return _id != FlowRouter.current().params.postId || 'sr-playlist__item-active';
	}
});
