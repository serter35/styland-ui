$(function () {
    $('.snb-dropper').on('click', function () {
        $(this).toggleClass('show');
    });
    $('#snb-mob-row > h5').on('click', function () {
        $('.snb-content').toggleClass('show');
    });
});