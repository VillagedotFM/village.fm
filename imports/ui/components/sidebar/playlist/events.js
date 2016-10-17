import {postToVote} from "./playlist.js";

//To eliminate some weirdness with SC.stream, make sure everything else is paused
pauseEverythingElse = function(id) {
  let posts = appBodyRef.postOrder.get();
  let nowPlaying = appBodyRef.nowPlaying.get();
  if (nowPlaying) {
    _.each(posts, function(post){
      if (post._id !== id) {
        if (post.type == 'soundcloud' && window['scplayer-' + post._id]) {
          window['scplayer-'+post._id].seek(0);
          window['scplayer-' + post._id].pause();
        } else {
          if (nowPlaying.type !== 'youtube' && window['ytplayer'] && window['ytplayer'].l) {
            window['ytplayer'].pauseVideo();
          }
        }
      }
    });
  }
}

Template.playlist.events({
    "click .upvote-block": function (event, template) {
      event.stopPropagation();
        if (Meteor.userId()) {
            let upvotedPost = this;
            if (Roles.userIsInRole(Meteor.userId(), ["admin"])) {

                postToVote.set(upvotedPost);
                $("#fakeUsersVotingModal").modal('show');
                $('#fakeUsersVotingModal').on('hidden.bs.modal', function () {
                    $("#fakeUsersVote").val(null);
                });
                Meteor.setTimeout(function () {
                    $("#fakeUsersVote").select2({
                        placeholder: "Select fake users",
                        allowClear: true
                    });
                }, 300);
            }
            else {
                Meteor.call('upvotePost', upvotedPost._id, function(err, affected) {
                if (err) {
                  appBodyRef.upvotedError.set(true);
                } else {
                  if(affected){
                    let postedBy = Meteor.users.findOne(upvotedPost.createdBy);
                    mixpanel.track('Upvoted a Post', {
                      postId: upvotedPost._id,
                      createdBy: postedBy.profile.name
                    });

                    window.analytics.totalPostsUpvoted = window.analytics.totalPostsUpvoted + 1;
                    mixpanel.register({
                        'totalPostsUpvoted': window.analytics.totalPostsUpvoted
                    });

                    mixpanel.people.increment({
                        'totalPostsUpvoted': 1
                    });

                    appBodyRef.upvotedSuccess.set(upvotedPost);
                    setTimeout(function(){
                      appBodyRef.upvotedSuccess.set(null);
                    }, 2000);

                  } else {
                    window.analytics.totalPostsUpvoted = window.analytics.totalPostsUpvoted - 1
                    mixpanel.register({
                        'totalPostsUpvoted': window.analytics.totalPostsUpvoted
                    });

                    mixpanel.people.increment({
                        'totalPostsUpvoted': -1
                    });
                  }
                }
              });
            }
        } else {
          mixpanel.track('Upvote attempted');
          appBodyRef.guestAction.set('upvotePost');
        }
    },
    "click .sr-playlist__play--play": function (event, template) {
        event.stopPropagation();
        let selectedId = this._id;
        let selectedType = this.type;
        let selectedPost = Posts.findOne(selectedId);
        let nowPlaying = appBodyRef.nowPlaying.get();

        if (selectedType === 'youtube') {
          if (nowPlaying && nowPlaying._id === selectedId) {
            appBodyRef.state.set(1);
            window['ytplayer'].playVideo();
          } else {
            appBodyRef.nowPlaying.set(selectedPost);
          }
        } else {
          appBodyRef.nowPlaying.set(selectedPost);
          appBodyRef.state.set(1);
          window['scplayer-' + selectedId].play();
        }

        mixpanel.track('Clicked play button', {
          area: 'Playlist'
        });
    },
    "click .sr-playlist__play--paused": function (event, template) {
        event.stopPropagation();
        let selectedId = this._id;
        let selectedType = this.type;

        if (selectedType === 'youtube') {
          appBodyRef.state.set(2);
          window['ytplayer'].pauseVideo();
        } else {
          appBodyRef.state.set(2);
          window['scplayer-' + selectedId].pause();
        }
    },
    "click .sr-playlist__remove": function (event, template) {
        let postId = this._id;
        let inboxId = Inbox.findOne({postId: postId, to: Meteor.userId()})._id;
        Inbox.remove({_id: inboxId});

    },

    'click #confirmFakeUsersVote': function (event, template) {
        if (postToVote.get()) {
            let fakeUsersVoting = $("#fakeUsersVote").val();
            console.log(fakeUsersVoting);
            if (!fakeUsersVoting || fakeUsersVoting.length == 0) {
                Meteor.call('upvotePost', postToVote.get()._id, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Upvoted!" + postToVote.get()._id);
                    }
                });
            }
            else {
                Meteor.call('upvotePostByFakeUsers', postToVote.get()._id, fakeUsersVoting, function (err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log("Upvoted!" + postToVote.get()._id);
                    }
                });
            }
            $("#fakeUsersVotingModal").modal('hide');
        }
    },

  'click .sr-playlist__right-btn': function(event, template) {
    $('.us-mobile').hide();
    $('.sidebar').hide();
    $('.container').show();
  },
  'click .after-post--overlay': function(event, template) {
    $('.after-post--overlay').hide();
    $('.after-post--bg').hide();
    $('.after-post--text').hide();
    $('.sidebar').removeClass('zindex');
    appBodyRef.postSuccess.set(null);
  }
});
