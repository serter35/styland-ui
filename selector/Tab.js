$(function () {
    $('.Tab').find('.tab-button').on('click', function () {
        $(this).siblings().removeClass('active');
        var dataId = $(this).addClass('active').closest('.Tab').data('contents');
        $(dataId).find('.tab-content').siblings().removeClass('active').eq($(this).index()).addClass('active');
        $(window).trigger('resize');
    });
});