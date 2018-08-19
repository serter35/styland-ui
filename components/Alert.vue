<template>
    <div id="alertcomponent">
        <div class="alert mar-5-y" :class="cssClass" v-if="show">
            <ul class="alert-message">
                <li v-for="message in messages">{{message}}</li>
            </ul>
            <i class="fa fa-times" @click="setShow(false)"></i>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                messages: [],
                show: false
            }
        },
        props: {
            input: Object
        },
        watch: {
            input(newVal) {
                this.messages = [];
                if (typeof newVal.message === 'string') {
                    this.messages.push(newVal.message);
                } else if (typeof newVal.error === 'object') {
                    let error = newVal.error;
                    for(let key in error) {
                        this.messages.push(error[key].param + ': ' + error[key].msg);
                    }
                }
                this.setShow(true);
                this.setShow(false, 3000);
            }
        },
        computed: {
            cssClass() {
                const statusCode = this.input.status_code;
                if (typeof statusCode !== "undefined") {
                    if (statusCode >= 200 && statusCode <= 299)
                        return {'alert-success': true}
                    else if (statusCode >= 300 && statusCode <= 399)
                        return {'alert-warning': true}
                    else if (statusCode >= 400 && statusCode <= 599)
                        return {'alert-danger' : true}
                }
                return;
            }
        },

        methods: {
            setShow(value, delayTime = 0) {
                setTimeout(() => {
                    this.show = value;
                }, delayTime)
            }
        }

    }
</script>

<!-- alertOptions: Object: { status_code: Integer, message: String | Object }-->