<template>
    <div class="sv-multi-select flex-items">
        <div class="sv-multi-select-box">
            <div class="sv-multi-select-search">
                <input type="text" v-model="selection_search" placeholder="Arama sözcüğü yazınız." @keyup.esc="selection_search = ''">
                <i class="fa-search"></i>
            </div>
            <ul class="sv-multi-select-list">
                <li v-for="(option) in selection_options" @click="onClickSelectionOption(option)">
                    {{option[textName]}}
                </li>
            </ul>
        </div>
        <div class="sv-multi-select-bar">
            <i class="fa-icon fa-arrow-left left" @click="moveToLeftAllOptions()"></i>
            <i class="fa-icon fa-arrow-right right" @click="moveToRightAllOptions()"></i>
        </div>
        <div class="sv-multi-select-box">
            <div class="sv-multi-select-search">
                <input type="text" v-model="selected_search" placeholder="Arama sözcüğü yazınız." @keyup.esc="selected_search = ''">
                <i class="fa-search"></i>
            </div>
            <ul class="sv-multi-select-list">
                <li v-for="option in selected_options" @click="onClickSelectedOption(option)">
                    {{option[textName]}}
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "sv-multi-select",
        props: {
            valueName: {
                type: String,
                default: 'id'
            },
            textName: {
                type: String,
                default: 'name'
            },
            value: {
                required: false,
                type: Array,
                default: []
            },
            options: {
                type: Array,
                required: true
            }
        },
        data() {
            return {
                selection_search: '',
                selected_search: '',
                selection: [],
                selected: [],
                checked: []
            }
        },
        watch: {
            value: {
                handler(val) {
                    this.setChecked(val);
                    this.setCollections(this.options);
                },
                immediate: true
            },
            options: {
                handler(val) {
                    this.setCollections(val);
                },
                deep: true
            }
        },
        methods: {
            setChecked(val) {
                this.checked = val;
            },
            setCollections(options) {
                if (this.checked.length != this.selected.length || this.checked.length == 0) {
                    this.selected  = [];
                    this.selection = [];
                    options.forEach(option => {
                        if (this.checked.includes(option[this.valueName])) {
                            this.selected.push(option);
                        } else {
                            this.selection.push(option);
                        }
                    });
                }
            },
            onClickSelectionOption(option) {
                const index = this.selection.findIndex(item => item[this.valueName] == option[this.valueName]);
                this.selection.splice(index, 1);
                this.selected.unshift(option);
                this.checked.unshift(option[this.valueName]);
                this.$emit('input', this.checked);
            },
            onClickSelectedOption(option) {
                const index = this.selected.findIndex(item => item[this.valueName] == option[this.valueName]);
                this.selected.splice(index, 1);
                this.selection.unshift(option);
                const indexOf = this.checked.indexOf(option[this.valueName]);
                this.checked.splice(indexOf, 1);
                this.$emit('input', this.checked);
            },
            moveToRightAllOptions() {
                this.selection = [];
                this.selected  = this.options;
                this.checked   = this.options.map(item => item[this.valueName]);
                this.$emit('input', this.checked);
            },
            moveToLeftAllOptions() {
                this.selected  = [];
                this.selection = JSON.parse(JSON.stringify(this.options));
                this.checked   = [];
                this.$emit('input', this.checked);
            }
        },
        computed: {
            selection_options() {
                return this.selection.filter(option => option[this.textName].toLocaleLowerCase('tr').trim().search(this.selection_search.toLocaleLowerCase('tr').trim()) !== -1 || this.selection_search == '')
            },
            selected_options() {
                return this.selected.filter(option => option[this.textName].toLocaleLowerCase('tr').trim().search(this.selected_search.toLocaleLowerCase('tr').trim()) !== -1 || this.selected_search == '')
            }
        },
        mounted() {
            this.setChecked(this.value);
            this.setCollections(this.options);
        }
    }
</script>