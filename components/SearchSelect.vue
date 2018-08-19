<template>
    <div class="search-select">
        <slot name="before"></slot>
        <div class="search-select-wrapper" :class="{'active': dropShow}">
            <div class="ss-input" @click.stop="setDropShow('toggle')">
            <span v-for="(option, index) in options" v-if="option.selected" :class="{'chip chip-xs': multiple == true}">
                {{getOptionText(option)}}
                <span class="chip-button" @click.stop="setSelected(index)" v-if="multiple == true"></span>
            </span>
            </div>
            <div class="ss-drop">
                <div class="ss-search">
                    <label class="fa-icon fa-search"></label>
                    <input type="text" v-model="search" placeholder="Liste İçerisinde Ara" @click.stop="">
                </div>
                <ul>
                    <li v-for="(option, index) in options" @click.stop="setSelected(index)" :class="[{'active': option.selected }, { 'hidden': !option.show }]"> {{getOptionText(option)}}</li>
                    <li v-if="options.every(option => option.show == false) && search != ''">Aradığınız Kriterlerde Sonuç Bulunamadı</li>
                </ul>
            </div>
        </div>
        <slot name="after"></slot>
    </div>
</template>

<script>
    export default {
        name: "search-select",
        props: {
            value: {
                required: true,
                type: Array,
            },
            multiple: {
                type: Boolean,
                default: false
            },
            selected: {
                type: [String, Number, Array],
            },
            chain: {
                type: Object
            },
            textName: {
                type: [String, Function],
                default: 'text'
            },
            valueName: {
                type: String,
                default: 'value'
            }
        },
        data() {
            return {
                search: '',
                options: [],
                selectedValue: null,
                dropShow: false
            }
        },
        watch: {
            value: "initSetter",
            search(newVal) {
                this.options.forEach((option, index) => {
                    let optionText = this.getOptionText(option);
                    if (optionText.toLocaleLowerCase().trim().search(newVal.toLocaleLowerCase().trim()) != -1 || newVal == '') {
                        if (this.getOptionShow(index))
                            option.show = true;
                        else
                            option.show = false;
                    }
                    else
                        option.show = false;
                })
            },
            selected(newVal, oldVal) {
                if (typeof newVal !== "undefined" && newVal != null) {
                    this.selectedValue = newVal;
                    this.initSetter();
                }
            },
            selectedValue(value) {
                this.$emit('input', value);
            },
            "chain.value": {
                handler(newVal, oldVal) {
                    console.log('chain', oldVal, newVal)
                    if (typeof oldVal !== "undefined") {
                        this.setSelectedValue({value: '', status: false});
                    }
                    this.options.forEach(item => {
                        if (typeof oldVal !== "undefined") {
                            item.selected = false;
                        }
                        if (item[this.chain.key] != newVal && typeof item[this.chain.key] !== "undefined") {
                            item.show = false;
                        } else {
                            item.show = true;
                        }
                    })
                }
            }
        },
        methods: {

            /*
             * Option Listesinin ve Selected Collection İlk Derlenmesi İçin Yapılan Setter Fonksiyon
             * Selected ve Show Özelliklerinin Option İçerisine Ekleniyor
             */
            initSetter() {
                this.options        = [];
                let optionObj       = {};

                for (let index = 0; index < this.value.length; index++) {
                    optionObj             = JSON.parse(JSON.stringify(this.value[index]));
                    optionObj['selected'] = this.getOptionSelected(index);
                    optionObj['show']     = this.getOptionShow(index);

                    this.$set(this.options, index, optionObj);
                }
            },

            /*
             * Option seçili şekilde mi gelmeli ?
             * Select Prop Değişkeni Esas Alınarak İlk Derlenme Aşamasında Çalışır.
             * initSetter() <-- getOptionSelected(i)
             */
            getOptionSelected(optionIndex) {
                if (typeof this.selected !== "undefined") {
                    if (this.multiple == true) {
                        let index = this.selected.indexOf(this.value[optionIndex][this.valueName]);
                        return index !== -1;
                    } else {
                        return this.selected == this.value[optionIndex][this.valueName];
                    }
                }
                return false;
            },

            /*
             * Option Gözükecek mi Yoksa Gizlenecek mi ?
             * Chain Prop Nesnesi Esas Alınarak İlk Derlenme Aşamasında Çalışır.
             * initSetter() <-- getOptionShow(i)
             */
            getOptionShow(optionIndex) {
                if (typeof this.chain === "undefined") {
                    return true;
                } else if (this.chain.value == this.value[optionIndex][this.chain.key]){
                    return true;
                }
                return false;
            },

            /*
             * Liste Item veya Multiple Chip Button Tıklanmasıyla Çalışan Fonksiyon
             * Event Listener & Event Handler
             */
            setSelected(optionIndex) {
                if (this.multiple == true) {
                    this.options[optionIndex].selected = !this.options[optionIndex].selected;
                } else {
                    this.options.forEach((option, index) => {
                        if (optionIndex == index) {
                            this.$set(option, 'selected', !option.selected)
                        } else {
                            this.$set(option, 'selected', false)
                        }
                    });
                    this.setDropShow('toggle');
                }
                this.setSelectedValue({
                    value : this.options[optionIndex][this.valueName],
                    status: this.options[optionIndex].selected
                });
            },

            /*
             *  Üst komponent'e gönderilecek selected değişkenin set fonksiyon
             */

            setSelectedValue({value, status}) {
                if (this.multiple == true) {
                    if (this.selectedValue == null) {
                        this.selectedValue = [];
                    }
                    if (status) {
                        this.selectedValue.push(value);
                    } else {
                        this.selectedValue.splice(this.selectedValue.indexOf(value), 1);
                    }
                } else {
                    if (status) {
                        this.selectedValue = value;
                    } else {
                        this.selectedValue = '';
                    }
                }
            },


            /*
             * Drop List Açılıp Kapanmasını Sağlayan Fonksiyon
             */
            setDropShow(elName = '') {
                if (elName == 'toggle') {
                    this.dropShow =! this.dropShow;
                } else {
                    this.dropShow = false;
                }
            },

            /*
             * Window Tıklanma Dinleyicisi. Dropdown Kapatma İşlemi İçin Yapılır.
             */
            windowClickEventListener() {
                window.addEventListener('click', () => {
                    this.setDropShow();
                });
            },

            getOptionText(option) {
                if (typeof this.textName === "function") {
                    return this.textName(option);
                } else if (typeof this.textName === "string") {
                    return option[this.textName];
                }
            }
        },
        mounted() {
            this.initSetter();
            this.windowClickEventListener();
        }
    }
</script>