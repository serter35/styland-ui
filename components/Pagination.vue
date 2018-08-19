<template>
    <div id="pagination" class="paginate-content">
        <ul class="pagination" v-if="pageCount">
            <li class="page-button" :class="{'disabled': ActivePageNumber === 1}"><a href="#" @click.prevent="changePage(ActivePageNumber - 1)">Geri</a></li>
            <li class="page-button" :class="{'active': ActivePageNumber == pageNumber}" v-for="pageNumber in pageCount">
                <a href="#" v-text="pageNumber" @click.prevent="changePage(pageNumber)"></a>
            </li>
            <li class="page-button" :class="{'disabled': ActivePageNumber === pageCount}"><a href="#" @click.prevent="changePage(ActivePageNumber + 1)">İleri</a></li>
        </ul>
    </div>
</template>

<script>
    export default {
        name: "pagination",
        props: {
            total: {
                required: true,
                type: Number
            },
            limit: {
                required: true,
                type: Number
            },
            offset: {
                required: true,
                type: Number
            },
        },
        watch: {
            offset(newVal, oldVal) {
                if (newVal === oldVal) {
                    this.Offset = newVal;
                }
            },
            total(newVal) {
                this.Offset           = 0;
                this.ActivePageNumber = 1;
                this.$emit('changeOffset', this.Offset);
            }
        },
        data() {
            return {
                Offset: 0,
                ActivePageNumber: 1
            }
        },
        methods: {
            changePage(pageNumber) {
                let offset = pageNumber * this.limit - this.limit;
                if (pageNumber !== this.ActivePageNumber && pageNumber >= 1 && pageNumber <= this.pageCount) {
                    this.ActivePageNumber = pageNumber;
                    this.Offset           = offset
                    this.$emit('changeOffset', this.Offset)
                }
            }
        },
        computed: {
            pageCount() {
                return Math.ceil(this.total / this.limit);
            }
        },
        mounted() {
            this.Offset = this.offset;
        }
    }
</script>

<style scoped>

</style>