(function ($) {
    $.fn.dropdown = function () {
        var _this = this;
        _this.children('a').on('click', function (e) {
            $(this).parent().transitionEffect();
            e.stopPropagation();
            e.preventDefault();
        });
        $(document).on('click', function (e) {
            _this.transitionEffect({state: 'leave'});
        });
    }
}(jQuery));