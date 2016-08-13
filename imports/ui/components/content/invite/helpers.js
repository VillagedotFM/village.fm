Template.invite.helpers({
  village() {
    return Villages.findOne({});
  },
  firstUsers() {
    if (Villages.findOne({}, {fields: {users: 1}}).users.length > 8)
      return Villages.findOne({}, {fields: {users: 1}}).users.slice(0,8);

    return Villages.findOne({}, {fields: {users: 1}}).users;
  },
  dottedUsers() {
    if (Villages.findOne({}, {fields: {users: 1}}).users.length > 8) {
      return Villages.findOne({}, {fields: {users: 1}}).users.slice(8,Villages.findOne({}, {fields: {users: 1}}).users.length);
    } //Dropdown on hover of circle with ellipsis
  }
});
