$(document).ready(function(){

    $('body').click(function(){
        $('.onboarding-popup').hide();
    })
    
    $('.upload-section__input').click(function() {
        $('.upload-section__upload').addClass('after-onboarding');
        $('.after-onboarding__overlay').show();
    });
    $('.after-onboarding__overlay').click(function() {
        $('.upload-section__upload').removeClass('after-onboarding');
        $(this).hide();
    });

    $('.feedback').click(function(evt){
        evt.preventDefault();
        $(this).toggleClass('active');
        $('.feedback__contant').slideToggle();
    });

    $('.song-switcher').click(function(){
        $('.song-switcher').removeClass('active');
        $(this).addClass('active');
    });

    $('.bottom-player__song-more').click(function(){
        $('.player-options__wrapper').toggleClass('visible');
    });

    $('.uploaded-item form').submit(function(evt){
        evt.preventDefault();
        $('.uploaded-item form').toggleClass('hidden');
        $('.post-sheduled').toggleClass('visible');
    });

    $('.send-to-friend__send-btn').click(function(){
        $('.send-to-friend__popup').show();
    });
    $('.send-to-friend__popup--close').click(function(){
        $('.send-to-friend__popup').hide();
    });

    if (window.matchMedia("(min-width: 768px)").matches){
        $('.sr-playlist__item--active').click(function(){
            $(this).addClass('popup');
            $('.sidebar').addClass('zindex');
            var left, top;

            left = $(this).offset().left + 'px';
            top = $(this).offset().top + 'px';
        
            $('.after-post--bg').show().css({left: left,top: top});
            $('.after-post--text').show().css({left: left,top: top});
            $('.after-post--overlay').show();
        });
        $('.after-post--overlay').click(function(){
            $(this).hide();
            $('.after-post--bg').hide();
            $('.after-post--text').hide();
            $('.sidebar').removeClass('zindex');
        });
    }
    
});