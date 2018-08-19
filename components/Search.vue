<template>
    <div id="search" class="list-search">
        <div class="input icon right">
            <input type="text" placeholder="Kelime Ara" v-model="searchInput" @keyup.enter="keyupEnter" @keyup.esc="keyupEsc">
            <label><i @click="keyupEnter()" class="fa fa-search"></i></label>
        </div>
    </div>
</template>

<script>
    export default {
        name: "search",
        data() {
            return {
                searchInput: ''
            }
        },
        watch: {
            searchInput(newVal) {
                if (newVal.length === 0) {
                    this.$emit('keyupEnter', newVal);
                }
            }
        },
        methods: {
            keyupEnter() {
                this.$emit('keyupEnter', this.searchInput);
            },
            keyupEsc() {
                this.searchInput = '';
                this.$emit('keyupEnter', this.searchInput);
            }
        }
    }
</script>

<style scoped>
    #search .fa-search {
        cursor: pointer;
    }
</style>