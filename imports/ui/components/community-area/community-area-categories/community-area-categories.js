import './community-area-categories.html';
import './events.js';
import './helpers.js';


Template.community_area_categories.onRendered(function() {

  // Create "Priority+ Navigation Pattern" for community area categories
  function resizeCategoriesNav() {
    let $categoriesNavs = $('.vf-community-area__categories');

    $categoriesNavs.each(function() {
      let $nav = $(this)
      if($nav.is(':visible')) {
        let $inlineCategories = $nav.find('> .vf-community-area__category');
        let $dropdown = $nav.find('.vf-community-area__categories__dropdown');
        let $dropdownCategories = $nav.find('.vf-community-area__categories__dropdown .vf-community-area__category');

        const totalCategories = $inlineCategories.length;
        let currentlyVisible = totalCategories - 1;

        $inlineCategories.removeClass('hidden');
        $dropdown.addClass('hidden');
        $dropdownCategories.addClass('hidden');

        if($nav.innerHeight() > $inlineCategories.first().innerHeight() * 1.5) {
          $dropdown.removeClass('hidden');

          for(let i = totalCategories - 1; i >= 0; i--) {
            if($nav.innerHeight() > $inlineCategories.first().innerHeight() * 1.5) {
              $inlineCategories.eq(currentlyVisible).addClass('hidden');
              $dropdownCategories.eq(currentlyVisible).removeClass('hidden');
              currentlyVisible--;
            }
          }
        }
      }
    })
  }

  $(window).on('resize',resizeCategoriesNav);

  resizeCategoriesNav();

  // Show/hide categories in header on scroll
  $(window).scroll(function() {
    if ( $(window).scrollTop() >= $('.main').offset().top ) {
      $('.vf-header').addClass('vf-header--show-categories');
    } else {
      $('.vf-header').removeClass('vf-header--show-categories');
    }
});
})
