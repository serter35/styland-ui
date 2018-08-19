(function ( $ ) {
    $.fn.transitionEffect = function (options) {
        var _this = this;
        const settings = $.extend({
            duration:       300,
            beforeActiveFn: function (el) {},
            afterActiveFn:  function (el) {},
            beforeLeaveFn:  function (el) {},
            afterLeaveFn:   function (el) {},
            activeClass:    'active',
            leaveClass :    'leave',
            state:          'toggle'
        }, options);

        if (this.hasClass(settings.activeClass)) {
            if (settings.state == 'toggle' || settings.state == 'leave') {
                settings.beforeLeaveFn(this);
                this.removeClass(settings.activeClass).addClass(settings.leaveClass);
                setTimeout(function () {
                    _this.removeClass(settings.leaveClass);
                    settings.afterLeaveFn(_this);
                }, settings.duration)
            }
        } else if (settings.state == 'toggle' || settings.state == 'active') {
            settings.beforeActiveFn(_this);
            _this.addClass(settings.activeClass);
            settings.afterActiveFn(_this);
        }

        return this;
    }
}( jQuery ));