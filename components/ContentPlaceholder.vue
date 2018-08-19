<template>
    <div class="content-placeholder">
        <div class="cont-pl-image" v-if="photo.show">
            <p><span></span><span></span></p>
            <p></p>
        </div>
        <div class="gr">
            <header
                    class="cont-pl-title"
                    :class="[getItemSizeClass(null, 'header')]"
                    v-if="title.show"
            >
                <p><span></span><span></span></p>
                <p v-show="body.count != 0"></p>
            </header>
            <div
                    class="cont-pl-body"
                    :class="[getItemSizeClass(index, 'body')]"
                    v-for="index in body.count"
            >
                <p><span></span><span></span></p>
                <p v-show="index != body.count"></p>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "content-placeholder",
        props: {
            paragraph: {
                type: [Number, Object],
                default: 4
            },
            header: {
                type: [Boolean, Object],
                default: true
            },
            image: {
                type: [Boolean, Object],
                default: false
            }
        },
        data() {
            return {
                title: '',
                body: '',
                photo: ''
            }
        },
        methods: {
            setBody() {
                if (typeof this.paragraph === 'number') {
                    this.body = {
                        count: this.paragraph,
                    }
                } else if (typeof this.paragraph === 'object') {
                    this.body = JSON.parse(JSON.stringify(this.paragraph));
                }
            },
            setHeader() {
                if (typeof this.header === 'boolean') {
                    this.title = {
                        show: this.header
                    }
                } else if (typeof this.header === 'object') {
                    this.title = JSON.parse(JSON.stringify(this.header));
                }
            },
            setPhoto() {
                if (typeof this.image === 'boolean') {
                    this.photo = {
                        show: this.image
                    }
                }
            },
            getItemSizeClass(index, elName) {
                if (typeof this[elName].size === 'string') {
                    return {['cont-pl-' + elName + '-' + this[elName].size]: true };
                } else if (typeof this[elName].size === 'object') {
                    return { ['cont-pl' + elName + '-' + this[elName].size[index.toString()]]: true }
                }
                return;
            }
        },
        mounted() {
            this.setBody();
            this.setHeader();
            this.setPhoto();
        }
    }
</script>
