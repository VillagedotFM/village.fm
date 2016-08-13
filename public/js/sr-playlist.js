// $(document).ready(function(){
//     (function () {
//         if(window.matchMedia("(min-width: 768px)").matches){
//             //Playlist height
//             var headerHeight, sidebar, sidebarOffset, playlist;
//
//             //Perfect scrollbar
//             $('.sr-playlist').perfectScrollbar();
//
//
//             //Profile page sidebar
//             sidebar = $('.sidebar');
//
//             if (sidebar.hasClass('sidebar--profile-page')) {
//                 sidebarOffset = sidebar.offset().top;
//
//                 $('.wrapper').on('scroll', function(){
//                     scrollTop = $(this).scrollTop();
//
//                     if (scrollTop > sidebarOffset) {
//                         sidebar.removeClass('sidebar--profile-page');
//                     } else {
//                         sidebar.addClass('sidebar--profile-page');
//                     }
//                 });
//             }
//         }
//     }());
// });
