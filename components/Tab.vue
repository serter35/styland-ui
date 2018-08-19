<template>
    <div class="Tab type-2">

        <div class="tab-slide-content" v-if="value.length > slideCount">
            <div class="tbuts" id="slide">
                <ul class="tab-buttons swiper-wrapper" :ref="tabId">
                    <li class="tab-button swiper-slide"
                        v-for="(button, index) in value"
                        :class="[button.className, {active: activeIndex == index}]"
                        @click="onClick(index)"
                    >{{button.text}}</li>
                </ul>
            </div>
        </div>

        <ul class="tab-buttons" v-else>
            <li class="tab-button"
                v-for="(button, index) in value"
                :class="[button.className, {active: activeIndex == index}]"
                @click="onClick(index)"
            >{{button.text}}</li>
        </ul>

        <ul class="tab-contents">
            <slot :activeIndex="activeIndex"></slot>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "tab",
        props: {
            value: {
                required: true,
                type: Array
            },
            tabCount:{
                default: 6,
                required: false
            },
        },
        data() {
            return {
                activeIndex: 0,
                tabId: '',
                showCountLimit: 0,
                slideCount: this.tabCount,
            }
        },
        methods: {
            onClick(index) {
                this.activeIndex = index;
                this.$emit('input', index)
            },

            sldTabShowing() {
                if (window.innerWidth > 1400) {
                    this.slideCount = 6;
                } else if (window.innerWidth >= 1024) {
                    this.slideCount = 4;
                } else if (window.innerWidth > 960){
                    this.slideCount = 2;
                }else {
                    this.slideCount = 2;
                }
                console.log('slidecount' + this.slideCount);
                console.log('value' + this.value.length);
            }
        },
        created() {
            this.tabId = 'vt-buttons-' + parseInt(Math.random() * 100000000000);
        },
        mounted() {
            $(window).on("resize", () => {
                this.sldTabShowing();
            })
        },
        updated() {
            this.sldTabShowing();
            new Swiper('#slide', {
                slidesPerView: this.slideCount,
                spaceBetween: 10,
                grabCursor: true,
                // slidesPerGroup: 3,
                // freeMode: false,
                loop: false,
                // loopFillGroupWithBlank: true,
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
            });
        }
    }
</script>
<style>

</style>
<!--
    /// HOW TO USE ///

    <tab :value="tabButtons">
        <template scope="props">
            <li class="tab-content" :class="{'active': props.activeIndex == 0}">
                A
            </li>
            <li class="tab-content" :class="{'active': props.activeIndex == 1}">
                B
            </li>
        </template>
    </tab>

    /// PROPS REFERENCES ///

    * value
        - required: true
        - type: Array (Object Items)
            className
                type: String
                required: false
            text
                type: String
                required: false

            EG: this.tabButtons = [
                { text: 'Yarı Mamül Stoğu' },
                { text: 'Tedarikçi Bazlı Stok' }
            ]
-->