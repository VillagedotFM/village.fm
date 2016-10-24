(function(){

    if(window.matchMedia("(max-width: 767px)").matches){
        //Mobile menu
        // var content =  $('.main, .header, .bottom-player, .us-mobile');
        // $('.header__hum').on('click', function(){
        //     $(this).toggleClass('header__hum--active');
        //     content.toggleClass('menu-open');
        // });
        //
        //
        // function hideMenu(){
        //     content.removeClass('menu-open');
        //     $('.header__hum').removeClass('header__hum--active');
        // }

        //Notifications
        $('.header__notifications').on('click', function(){
            $('.ntf-dropdown').show();
            $('html, body').addClass('overflow-hidden');
        });
        $('.ntf-dropdown__back').on('click', function(e){
            e.stopPropagation();
            $('.ntf-dropdown').hide();
            $('html, body').removeClass('overflow-hidden');
        });

        //Now playing toggle
        // $('.bottom-player').on('click', function(){
        //     $(this).hide();
        //     $('.now-playing').show();
        //     $('html, body').addClass('overflow-hidden');
        //     $('.main, .header').addClass('blur');
        // });
        // $('.now-playing__arrow-down').on('click', function(){
        //     $('.now-playing').hide();
        //     $('.bottom-player').show();
        //     $('html, body').removeClass('overflow-hidden');
        //     $('.main, .header').removeClass('blur');
        // });
    }
}());
