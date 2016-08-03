Array.prototype.move = function(from,to){
  this.splice(to,0,this.splice(from,1)[0]);
  return this;
};

checkAndMoveSelectedPost = function(posts) {
	// If Selected Post
	if (FlowRouter.current().params.postId) {
	  const selectedPostId = FlowRouter.current().params.postId;
	  const selectedPostIndex = posts.map(function(x) {return x._id; }).indexOf(selectedPostId);
	  // If selected post isn't already first in array
	  if (selectedPostIndex > 0) {
	    // Swap 0 post to the 1 place and selected to 0
	    posts.move(selectedPostIndex,0);
	  }
	}
  return posts;  
}