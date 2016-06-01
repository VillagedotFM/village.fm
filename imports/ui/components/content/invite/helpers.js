Template.invite.helpers({
  village() {
    return Villages.findOne({});
  },
  firstUsers() {
    return Villages.findOne({}, {fields: {users: 1}, limit: 8}).users;
  },
  dottedUsers() {
    return Villages.findOne({}, {fields: {users: 1}, skip: 8}).users; //Dropdown on hover of circle with ellipsis
  }
});
