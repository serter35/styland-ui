$(function () {
    $('.input-underline').each(function () {
        if($(this).val() !== '') {
            $(this).addClass('active');
        }
    });
    $('.input-underline').find('input').on('focusin', function () {
        $(this).parent().addClass('active');
    }).on('focusout', function () {
        if ($(this).val() == '') {
            $(this).parent().removeClass('active');
        }
    });
});



