$(function () {
    $('.tnb-mob-btn').on('click', function () {
        if (!$('.tnb-mob-nav').hasClass('active')) {
            $('.tnb-mob-nav').addClass('active');
            $('.tnb-mob-btn').addClass('active').css('left', ($(window).width() - $(window).width() * 0.85) + 'px');
            $('body').addClass('tnb-mob-active-body');
        } else {
            $('.tnb-mob-nav').removeClass('active').addClass('leave');
            $('.tnb-mob-btn').removeClass('active').css('left', '15px');
            $('body').removeClass('tnb-mob-active-body');
            setTimeout(function () {
                $('.tnb-mob-nav').removeClass('leave');
            }, 300)
        }

    });
    $('.tnb-mob-nav-item').on('click', function () {
        $(this).toggleClass('active').find('ul').slideToggle();
    });
    $('#topnavbar-user-drop').dropdown();
});
