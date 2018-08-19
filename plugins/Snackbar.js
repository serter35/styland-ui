(function ($) {
    $.fn.snackbar = function (options) {
        function newElement(parentElText, parentElType ,elTextNode = "", elClassName = "", elAttr = {}, elTag = "div") {
            const el = document.createElement(elTag);
            const tn = document.createTextNode(elTextNode);
            el.appendChild(tn);
            el.className = elClassName;
            if (Object.keys(elAttr).length > 0) {
                for (let key in elAttr) {
                    el.setAttribute(key, elAttr[key]);
                }
            }
            if (parentElType === "id") {
                const appendEl = document.getElementById(parentElText);
                appendEl.appendChild(el);
                return appendEl;
            } else if (parentElType === "class") {
                const appendEl = document.getElementsByClassName(parentElText);
                appendEl[0].appendChild(el);
                return appendEl;
            }
        }
        const settings = $.extend({
            status  : 'default',
            position: 'top right',
            message : 'Buraya bir text yazınız.',
            timeout : 5000,
            duration: 300,
            closable: false
        }, options);
        let parentClassSelector = '.snackbar' + settings.position.split(' ').join('.').replace('', '.');
        let parentClassName     = "snackbar " + settings.position;
        let childClassName      = "snackbar-item " + settings.status

        if (this.has(parentClassSelector).length === 0) {
            newElement(this.attr('id'), "id", "", parentClassName);
        }
        newElement(parentClassName, "class", settings.message, childClassName);

        let jqParentEl = this.find(parentClassSelector);
        let jqChildEl  = jqParentEl.find('.snackbar-item').last();
        let classObj = {
            "-webkit-transition-duration": settings.duration + "ms",
            "transition-duration": settings.duration + "ms"
        }

        // Showed State
        jqChildEl.css(classObj);
        setTimeout(() => {
            jqChildEl.transitionEffect({duration: settings.duration});
        }, 250)

        // Hidden State
        if (!settings.closable) {
            setTimeout(() => {
                jqChildEl.transitionEffect({duration: settings.duration});
                setTimeout(() => {
                    jqChildEl.remove();
                    if (jqParentEl.children().length === 0) {
                        jqParentEl.remove();
                    }
                }, settings.duration)
            }, settings.timeout)
        }


        return this;
    }
}(jQuery))