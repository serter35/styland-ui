<template>
    <div class="relative">
        <div v-if="progress && progressValue < 100" class="transform-center">
            <span>Yükleniyor |  {{progressValue.toFixed(2)}}<i class="fas fa-spin fa-spinner mar-10-l"></i></span>
        </div>
        <img :src="src" alt="" width="100%" height="100%" style="object-fit: cover" class="wrap-out">
    </div>
</template>
<script>
    export default {
        name: 'sv-image',
        props: {
            progress: {
                type: Boolean,
                default: false
            },
            lazy: {
                type: Boolean,
                default: true
            },
            source: {
                type: String,
                required: true
            }
        },
        data() {
            return {
                src: '',
                scrollPosY: -1,
                elPosY: -1,
                progressValue: 0,
                progressing: false
            }
        },
        methods: {
            lazyHandler() {
                if (this.lazy) {
                    this.scrollHandler();
                    this.scrollEventListener();
                } else {
                    this.progressHandler();
                }
            },
            scrollHandler() {
                this.setPositions();
                if (this.elPosY + this.$el.clientHeight >= window.scrollY && this.elPosY <= this.scrollPosY) {
                    this.progressHandler();
                }
            },
            setPositions() {
                this.scrollPosY = window.scrollY + window.innerHeight;
                this.elPosY     = this.$el.offsetTop;
            },
            progressHandler() {
                if (this.progress) {
                    if (!this.progressing) {
                        this.progressing = true;
                        axios.get(this.source, {
                            responseType: 'blob',
                            onDownloadProgress: (prog) => {
                                this.progressValue = prog.loaded / prog.total * 100
                            }
                        }).then(res => {
                            let file = new Blob([res.data], {type: res.data.type});
                            this.src = URL.createObjectURL(file);
                        })
                    }
                } else {
                    this.src = this.source;
                }
            },
            scrollEventListener() {
                document.addEventListener('scroll', this.scrollHandler)
            },
        },
        mounted() {
            this.lazyHandler();
        }
    }
</script>