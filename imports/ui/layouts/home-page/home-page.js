import './home-page.html';

import { Villages } from '../../../api/villages/villages.js';
import '../../components/start-village/start-village.js';

Template.home_page.onCreated(() => {
  homePageRef = this;
  homePageRef.activeVillage = new ReactiveVar(1);

  Meteor.subscribe("villages.sideMenu");
});

Template.home_page.onRendered(() => {
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

  $(window).resize(function() {
    $('.villages-carousel-items, .selection-carousel').slick('resize');
  });

  $(window).on('orientationchange', function() {
    $('.villages-carousel-items, .selection-carousel').slick('resize');
  });
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
    if (Meteor.userId()) {
      startVillageRef.step.set('details');
    } else {
      startVillageRef.step.set('signup');
    }


    mixpanel.track('Clicked Get a Village', {
      'panelNumber': event.currentTarget.dataset.mixpanelPanelNumber
    });
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
  }
});
