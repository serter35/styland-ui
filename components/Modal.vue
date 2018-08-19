<template>
    <div class="Modal">
        <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
            <div class="mod-transparent-layer" @click="onClickWhiteSpace()" v-show="show" style="animation-duration: 500ms"></div>
        </transition>
        <transition enter-active-class="animated fadeInDown" leave-active-class="animated fadeOutUp">
            <div class="mod-box" v-show="show" style="animation-duration: 500ms">
                <a class="mod-close-icon" @click.prevent="setShow(false)" v-if="closable"></a>
                <slot name="header"></slot>
                <slot name="body"></slot>
                <slot name="footer"></slot>
            </div>
        </transition>
    </div>
</template>

<script>
    export default {
        props: {
            value: {
                required: true,
                type: Boolean,
                default: false
            },
            closable: {
                type: Boolean,
                default: true
            }
        },
        watch: {
            value: "setShow"
        },
        data() {
            return {
                show: false
            }
        },
        methods: {
            setShow(value) {
                this.show = value;
                this.$emit('input', value);
            },
            onClickWhiteSpace() {
                if (this.closable) {
                    this.setShow(false);
                }
            }
        },
        mounted() {
            this.setShow(this.value);

            // On KeyUp Escape Key Event Listener
            if (this.closable) {
                window.addEventListener('keyup', (e) => {
                    if (e.keyCode === 27) {
                        this.setShow(false);
                    }
                })
            }
        }
    }
</script>