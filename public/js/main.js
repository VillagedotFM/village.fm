$(document).ready(function(){
  
    (function () {
      // var lastListensBlock = $('.last-listens__inner');
      //
      // if(lastListensBlock.length !== 0){
      //     var lastListensWidth, lastListensItem;
      //
      //     lastListensItem = $('.last-listens__item');
      //     lastListensWidth = lastListensItem.length * lastListensItem.outerWidth();
      //     lastListensBlock.css('width', lastListensWidth + "px");
      //
      //     $('.last-listens__wrap').perfectScrollbar();
      // }


        //Uploaded item cancel
        $('.uploaded-item__cancel').on('click', function(){
            $('.uploaded-item').hide();
        });

        //Post/comment toggle
        $('.post__comments').on('click', function(){
            var id = $(this).data('id');
            var comment = $('.comments-block[data-id="' + id +'"]');
            var send = $('.send-to-friend[data-id="' + id +'"]');

            $('.post__send').removeClass('active');
            $(this).addClass('active');
            send.hide();
            comment.show();
        });
        $('.post__send').on('click', function(){
            var id = $(this).data('id');
            var comment = $('.comments-block[data-id="' + id +'"]');
            var send = $('.send-to-friend[data-id="' + id +'"]');

            $('.post__comments').removeClass('active');
            $(this).addClass('active');
            comment.hide();
            send.show();
        });

        //Inbox elements
        $('.sr-inbox__arrow').on('click', function(){
            $('.sr-playlist__item--inbox').toggle();
            $(this).toggleClass('fa-caret-up');
        });

        //Last-listens block width
        var lastListensBlock = $('.last-listens__inner');

        if(lastListensBlock.length !== 0){
            var lastListensWidth, lastListensItem;

            lastListensItem = $('.last-listens__item');
            lastListensWidth = lastListensItem.length * lastListensItem.outerWidth();
            lastListensBlock.css('width', lastListensWidth + "px");

            $('.last-listens__wrap').perfectScrollbar();
        }

        //Sign-up block
        $('.header-profile__thumb').on('click', function(e){
            e.stopPropagation();
            $('.sign-up').show();
        });
        $('.sign-up').on('click', function(e){
            e.stopPropagation();
        });


        $('.more-users-dropdown__wrap').perfectScrollbar();
    }());
});
