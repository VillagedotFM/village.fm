Template.inbox.events({
  "click .sr-inbox__arrow, click .sr-inbox__title": function(event, template){
    if (appBodyRef.inboxOpen.get()) {
      appBodyRef.inboxOpen.set(false);
    } else {
      appBodyRef.inboxOpen.set(true);
    }
  }
});
