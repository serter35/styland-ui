<template>
    <header class="TopNavBar">
        <div class="container-xl">
            <div class="tnb">
                <h3 class="tnb-logo">Boolity</h3>
                <i class="tnb-mob-btn" @click="mobMenuToggle()"></i>
                <nav class="tnb-nav" :style="navStyle">
                    <ul class="tnb-nav-inner">
                        <li class="tnb-nav-item" :class="item.class" v-for="item in items">
                            <router-link :to="item.href" class="tnb-nav-link" :class="item.linkClass">{{item.text}}</router-link>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    </header>
</template>

<script>
    export default {
        name: "Navbar",
        props: {
            items: {
                required: true,
                type: Array
            }
        },
        data() {
            return {
                navStyle: null,
                navHeight: 0
            }
        },
        methods: {
            mobMenuToggle() {
                if (this.navStyle === null) {
                    this.navStyle = {
                        height: this.navHeight
                    };
                } else {
                    this.navStyle = null;
                }
            },
            setHeight() {
                if (window.innerWidth >= 960) {
                    this.navHeight = null;
                } else {
                    this.navHeight = this.$el.querySelector('.tnb-nav-inner').offsetHeight + 'px';
                }
            }
        },
        mounted() {
            this.setHeight();
            window.addEventListener('resize', this.setHeight);
        }
    }
</script>