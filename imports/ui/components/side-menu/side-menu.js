import './side-menu.html';


Template.side_menu.events({
  'click .header__logo': () => {
    alert('123');
  }
})

Template.side_menu.helpers({
  'showSideMenu': () => {
    return appBodyRef.showSideMenu.get();
  }
})
