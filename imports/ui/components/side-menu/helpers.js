Template.side_menu.helpers({
  'villages': () => {
    return Villages.find({ slug: { $ne: '/' } }).fetch();
  }
})
