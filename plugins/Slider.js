(function($){
    $.fn.slider = function(option) {
        // Local Variables
        let containerSize = 0;
        let ulSize        = 0;
        let itemSize      = 0;
        let maxPage       = 0;
        let page          = 0;
        let showItemCount = 0;
        // Plugin Variables
        let setting = $.extend({
            prevEl: $("#prevBtn"),
            nextEl: $("#nextBtn"),
            slideOrientation: 'x',
            viewportShowItemCount: {
                'lg': 4,
                'md': 3,
                'sm': 2,
                'xs': 1
            },
            classNames: {
                outer: '',
                inner: '',
                item: '',
                nextBtn: '',
                prevBtn: ''
            }
        }, option)

        const init = () => {
            if ($(window).width() < 768) {
                showItemCount = setting.viewportShowItemCount.xs;
            }
            else if ($(window).width() < 960) {
                showItemCount = setting.viewportShowItemCount.sm;
            } else if ($(window).width() < 1170){
                showItemCount = setting.viewportShowItemCount.md;
            } else {
                showItemCount = setting.viewportShowItemCount.lg
            }
        }
        const initClassBinding = () => {
            const classList = setting.classNames;
            this.addClass(classList.outer).find("ul").addClass(classList.inner).find("li").addClass(classList.item);
            setting.prevEl.addClass(classList.prevBtn);
            setting.nextEl.addClass(classList.nextBtn);
        }
        const computed = () => {
            if (setting.slideOrientation === 'x') {
                // Outer Container Element (this) Get Width Size
                containerSize = this.outerWidth();
                // Item Element (li) Width Computing
                itemSize = containerSize / showItemCount;
                this.find("li").innerWidth(itemSize);
                maxPage = this.find("li").length - showItemCount;
                // Inner Container Element (ul) Width Computing
                ulSize = itemSize * this.find("li").length;
                this.find("ul").width(ulSize);
            } else if (setting.slideOrientation === 'y') {
                // Inner Container Element (this) Get Height Size
                containerSize = this.outerHeight();
                // Item Element (li) Height Computing
                itemSize = containerSize / showItemCount;
                this.find("li").innerHeight(itemSize);
                maxPage = this.find("li").length - showItemCount;
                // Outer Container Element (ul) Width Computing
                ulSize = itemSize * this.find("li").length;
                this.find("ul").height(ulSize);
            }

        }
        const slideEffect = () => {
            if (setting.slideOrientation === 'x') {
                this.find('ul').css('transform', 'translateX(-' + (itemSize * page) +'px)');
            } else {
                this.find('ul').css('transform', 'translateY(-' + (itemSize * page) +'px)');
            }
        }
        const itemClassBinding = () => {
            this.find('li').removeClass('showing');
            for (let i = page; i < (page + showItemCount); i++) {
                this.find("li").eq(i).addClass('showing');
            }
        }
        const buttonClickListener = () => {
            setting.nextEl.on("click", e => {
                e.preventDefault();
                if (page < maxPage) {
                    page++;
                }
                slideEffect();
                itemClassBinding();
                buttonClassBinding()
            });
            setting.prevEl.on('click', e => {
                e.preventDefault();
                if (page > 0) {
                    page--;
                    setting.nextEl.show();
                }
                slideEffect();
                itemClassBinding();
                buttonClassBinding();
            });
        }
        const buttonClassBinding = () => {
            if (page == 0) {
                setting.prevEl.addClass('hidden');
                setting.nextEl.removeClass('hidden');
            } else if (page == maxPage) {
                setting.prevEl.removeClass('hidden');
                setting.nextEl.addClass('hidden');
            } else {
                setting.prevEl.removeClass('hidden');
                setting.nextEl.removeClass('hidden');
            }
        }
        const windowResizeListener = () => {
            $(window).on('resize load', () => {
                init();
                this.page = 0;
                computed();
                slideEffect();
                itemClassBinding();
            });
        }

        init();
        initClassBinding();
        computed();
        slideEffect();
        itemClassBinding();
        buttonClickListener();
        buttonClassBinding();
        windowResizeListener();

        return this;
    }
})(jQuery)

/**
 * **** Slider Component Guide ****
 * $("#yourElementId").slider() - basic usage
 * $("#yourElementId").slider({ - setting usage
        prevEl: $("#yourPrevButton"),
        nextEl: $("#yourNextButton"),
        slideOrientation: 'y',
        viewportShowItemCount: {
            'lg': 6,
            'md': 4,
            'sm': 2,
            'xs': 2
        }
    })
 *  **** Slider Component Api ****
 *  prevEl: jquery element   - suggest id    - default value: $("#prevBtn")
 *  nextEl: jquery element   - suggest id    - default value: $("#nextBtn")
 *  slideOrientation: String - ('x' or 'y')  - default value: 'x'
 *  viewportShowItemCount: Object            - default value: {'lg': 4,'md': 3,'sm': 2,'xs': 1}
 */
