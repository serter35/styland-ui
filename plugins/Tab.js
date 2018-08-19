(function ( $ ) {
    $.fn.tab = function (options) {
        var settings = $.extend({
            'activeClassName' : 'active',
            'buttonClassName' : 'tab-button',
            'contentClassName': 'tab-content'
        }, options)
        this.find('.' + settings.buttonClassName).on('click', function () {
            var clickedIndex       = $(this).index();
            var tabContentSelector = $(this).parent().siblings('.tab-contents').children('.' + settings.contentClassName);
            tabContentSelector.removeClass(settings.activeClassName);
            tabContentSelector.eq(clickedIndex).addClass(settings.activeClassName);
            $(window).trigger('resize');
        });
    }
}( jQuery ));