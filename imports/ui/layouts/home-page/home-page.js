import './home-page.html';

Template.home_page.onCreated(() => {
  homePageRef = this;

  homePageRef.activeVillage = new ReactiveVar(1);
  homePageRef.getVillageModalActive = new ReactiveVar(false);
  homePageRef.thankYouModalActive = new ReactiveVar(false);

  homePageRef.requestCategory = new ReactiveVar(null);
  homePageRef.requestEmail = new ReactiveVar(null);

  // When all stylesheets an assets are loaded, fade in the page content 
  window.onload = () => {
    $('.vf-loading-wrapper').addClass('loaded');
  }
});

Template.home_page.onRendered(() => {
  $('.selection-carousel').each(function() {
    $(this).slick({
      mobileFirst: true,
      infinite: false,
      centerMode: true,
      centerPadding: '1rem',
      slidesToShow: 1,
      dots: true,
      arrows: false,
      responsive: [
        {
            breakpoint: 767,
            settings: 'unslick'
        }
      ]
    });
  });

  $('.villages-carousel-items').slick({
    mobileFirst: true,
    centerMode: true,
    centerPadding: '1rem',
    slidesToShow: 1,
    dots: true,
    arrows: false,
    responsive: [
      {
          breakpoint: 992,
          settings: 'unslick'
      }
    ]
  });

  $(window).resize(function() {
    $('.villages-carousel-items, .selection-carousel').slick('resize');
  });

  $(window).on('orientationchange', function() {
    $('.villages-carousel-items, .selection-carousel').slick('resize');
  });

  Tracker.autorun(() => {
    if(homePageRef.getVillageModalActive.get() === false) {
      homePageRef.requestEmail.set(null);
      homePageRef.requestCategory.set(null);
      $('.selection-carousel-item').removeClass('selected');
      $('.get-village-modal form input[type="email"]').val('');
    }
  })
});

Template.home_page.events({
  'click .scroll-down': () => {
    $('body').animate({
      scrollTop: $('.section-1').offset().top + 'px'
    }, 500);
  },
  'click .villages-carousel-links a': (event) => {
    homePageRef.activeVillage.set(event.target.dataset.item);
  },
  'click .get-village-btn': (event) => {
    homePageRef.getVillageModalActive.set(true);

    mixpanel.track('Clicked Get a Village', {
      'panelNumber': event.currentTarget.dataset.mixpanelPanelNumber
    });
  },
  'click .vf-modal.active': () => {
    if($(event.target).is('.vf-modal.active')) {
      homePageRef.getVillageModalActive.set(false);
      homePageRef.thankYouModalActive.set(false);
    }
  },
  'click .get-village-modal .vf-modal-close-btn': () => {
    homePageRef.getVillageModalActive.set(false);
  },
  'click .thank-you-modal button': () => {
    homePageRef.thankYouModalActive.set(false);
  },
  'click .get-village-modal .selection-carousel-item, click .get-village-modal .selection-carousel-item button': (event) => {
    let item = $(event.target).closest('.selection-carousel-item');
    let category = item.data('category');
    homePageRef.requestCategory.set(category);
    $('.selection-carousel-item').removeClass('selected');
    item.addClass('selected');

    mixpanel.track('Selected Category', {
      'category': category
    });
  },
  'keyup .get-village-modal form input[type="email"]': (event) => {
    let pattern =  /^[A-Z0-9\._%+-]+@[A-Z0-9\.-]+\.[A-Z]{2,}$/i;
    let email = event.target.value;
    if(pattern.test(email)) {
      homePageRef.requestEmail.set(email);
    } else {
      homePageRef.requestEmail.set(false);
    }
  },
  'submit .get-village-modal form': () => {
    const email = homePageRef.requestEmail.get();
    const category = homePageRef.requestCategory.get();

    Meteor.call('requestVillage', email , category, () => {
      homePageRef.getVillageModalActive.set(false);
      homePageRef.thankYouModalActive.set(true);

      mixpanel.track('Requested Village', {
        'category': category
      })
    });
    return false;
  },
  'click .logo, click .enter-village, click .villages-carousel-item a, click .footer-navigation a[data-mixpanel-button-name="Home"]': (event) => {
    event.preventDefault();
    mixpanel.track('Entered Village.fm', {
      'buttonName': event.currentTarget.dataset.mixpanelButtonName
    });
    setTimeout(() => {
      window.location = event.currentTarget.href;
    }, 500);
  }
});

Template.home_page.helpers({
  activeVillage: () => {
    return homePageRef.activeVillage.get();
  },
  getVillageModalActive: () => {
    return homePageRef.getVillageModalActive.get();
  },
  thankYouModalActive: () => {
    return homePageRef.thankYouModalActive.get();
  },
  invalidEmail: () => {
    return (homePageRef.requestEmail.get() === false);
  },
  invalidRequest: () => {
    return !(homePageRef.requestCategory.get() && homePageRef.requestEmail.get());
  }
});
