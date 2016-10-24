// hideMenu = function(){
//     $('.main, .header, .bottom-player, .us-mobile').removeClass('menu-open');
//     $('.header__hum').removeClass('header__hum--active');
// }
//
// Template.mobile_menu.events({
//   "click .mobile-menu__item--log-out": function(event, template){
//     Meteor.logout(function(err){
//       if (err) {
//           throw new Meteor.Error("Logout failed");
//       } else {
//         console.log("Logged Out!");
//       }
//     });
//   },
//   "click #mobileSignIn": function(event, template){
//     Meteor.loginWithFacebook({}, function(err){
//       if (err) {
//         throw new Meteor.Error("Facebook login failed");
//       } else {
//         console.log("Logged In!");
//         // $('.sign-up').hide();
//       }
//     });
//   },
//   'click .mobile-menu__item a': function(event, template){
//     var parent = $(this).parent();
//     $('.mobile-menu__item').removeClass('mobile-menu__item--active');
//     parent.addClass('mobile-menu__item--active');
//
//     hideMenu();
//   },
//   'click .mobile-menu__item--playlist': function(event, template) {
//     $('.us-mobile').hide();
//     $('.container').hide();
//     $('.sidebar').show();
//     hideMenu();
//   },
//   'click .mobile-menu__item--post': function(event, template) {
//     $('.us-mobile').show();
//     $('.sidebar').hide();
//     $('.container').show();
//     hideMenu();
//   },
//   'click .mobile-menu__logo, click .mobile-menu__item--profile': function(event, template) {
//     $('.us-mobile').hide();
//     $('.sidebar').hide();
//     $('.container').show();
//     hideMenu();
//   }
// });
