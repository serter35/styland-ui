<template>
    <div id="form-generator-root">
        <slot name="inputSlotTop"></slot>
        <div class="form-generator-inner" :class="containerClass">
            <template v-for="(item, index) in selfField">

                <!-- Checkbox -->
                <div class="choose choose-rectangle choose-primary" v-if="item.type == 'input' && item.inputType == 'checkbox'" :class="[elWrapperClass]">
                    <input type="checkbox"
                           :name="item.name"
                           :class="[item.customClass]"
                           :id="item.name"
                           :value="item.value"
                           :disabled="item.disabled"
                           v-model="deepInputs[item.model]"
                    />
                    <label :for="item.name" class="fa fa-check"></label>
                    <label :for="item.name" class="text" v-if="typeof item.label != 'undefined'">{{item.label}}</label>
                </div>

                <file
                    v-else-if="item.type == 'input' && item.inputType == 'file'"
                    :id="item.id"
                    :multiple="item.multiple"
                    :button-attr="item.button_attr"
                    :label="item.label"
                    @input="val => setInputWithFile(val, item.model)"
                    :value="deepInputs[item.model]"
                    :preview="item.preview"
                    :required="typeof item.optional === 'undefined'"
                >Bilgisayarına Gözat</file>

                <!--Input -->
                <div class="field-group" :class="{'optional': item.optional}" v-else-if="item.type == 'input' && item.inputType != 'file' && item.inputType != 'checkbox'">
                    <label
                            :for="item.name"
                            v-if="typeof item.label != 'undefined'"
                            v-html="item.label"
                    ></label>
                    <div :class="[elWrapperClass, item.icon ? 'icon' : '']" class="input">
                        <the-mask
                                :type="item.type"
                                :mask="item.mask"
                                :value="deepInputs[item.model]"
                                @input="val => $vueSet(inputs, item.model, val)"
                                :class="[item.customClass]"
                                :name="item.name"
                                v-if="item.mask"
                        ></the-mask>
                        <input  v-else
                                :type="item.inputType"
                                :name="item.name"
                                :class="[item.customClass]"
                                :id="item.name"
                                v-model="deepInputs[item.model]"
                        />
                        <label :class="[item.icon]" v-if="item.icon" @click="fieldIconCallback.fn(selfField, index, inputs)"></label>
                    </div>
                </div>

                <!-- Select -->
                <div class="field-group" :class="{'optional': item.optional}" v-else-if="item.type == 'select'">
                    <label :for="item.name" v-html="item.label"></label>
                    <div :class="[elWrapperClass, item.icon ? 'icon' : '']" class="input select">
                        <select
                                :name="item.name"
                                :id="item.name"
                                :class="[item.customClass]"
                                v-model="deepInputs[item.model]"
                        >
                            <option
                                    :value="optionItem[item.valueName ? item.valueName : 'value']"
                                    v-for="optionItem in item.option"
                                    v-if="typeof item.option != 'undefined'"
                            >
                                {{item.textName ? optionItem[item.textName] : optionItem['text']}}
                            </option>
                        </select>
                        <label :class="[item.icon]" v-if="item.icon" @click="fieldIconCallback.fn(selfField, index, inputs)"></label>
                    </div>
                </div>

                <!-- Search Select -->
                <div class="field-group" :class="{'optional': item.optional}" v-else-if="item.type == 'search-select'">
                    <label v-html="item.label"></label>
                    <search-select
                            :value="item.option"
                            :selected="deepInputs[item.model]"
                            :multiple="item.multiple"
                            @input="val => { $vueSet(inputs, item.model, val) }"
                            :chain="{key: item.chainKey, value: deepInputs[item.chainBy]}"
                            :textName="item.textName"
                            :valueName="item.valueName"
                    ></search-select>
                </div>

                <!-- Multi Select -->
                <div class="field-group" :class="[{'optional': item.optional}, item.groupClass]" v-else-if="item.type == 'multi-select'">
                    <label v-html="item.label"></label>
                    <multi-select
                            v-model="deepInputs[item.model]"
                            :textName="item.textName"
                            :valueName="item.valueName"
                            :options="item.options"
                    ></multi-select>
                </div>

                <!-- Textarea -->
                <div class="field-group" :class="{'optional': item.optional}" v-else-if="item.type == 'textarea'">
                    <label :for="item.name" v-if="typeof item.label != 'undefined'" v-html="item.label"></label>
                    <div :class="[elWrapperClass]" class="input">
                    <textarea :name="item.name"
                              :id="item.name"
                              :class="[item.customClass]"
                              v-model="deepInputs[item.model]"
                    ></textarea>
                    </div>
                </div>

                <!-- Radio Group -->
                <div class="field-group" :class="[elWrapperClass, {'optional': item.optional}]" v-else-if="item.type == 'radiogroup'">
                    <label v-if="typeof item.label != 'undefined'" v-html="item.label"></label>
                    <div class="choose-group">
                        <div class="choose choose-circle choose-primary" v-for="(optionItem, index) in item.option">
                            <input type="radio"
                                   :name="item.name"
                                   :class="[item.customClass]"
                                   :id="item.name + index"
                                   :value="optionItem.value"
                                   :disabled="item.disabled"
                                   v-model="deepInputs[item.model]"
                            />
                            <label :for="item.name + index" class="fa fa-check"></label>
                            <label :for="item.name + index" class="text">{{optionItem.text}}</label>
                        </div>
                    </div>
                </div>

                <div class="field-group" v-else-if="item.type == 'datepicker'" :class="[elWrapperClass, {'optional': item.optional}]">
                    <label v-if="typeof item.label != 'undefined'" v-html="item.label"></label>
                    <datepicker
                            wrapper-class="input"
                            :language="dateLanguage"
                            @input="val => setDatepickerInput(val, item.model)"
                            :value="deepInputs[item.model]"
                    ></datepicker>
                </div>

            </template>
        </div>
        <slot name="inputSlotBottom"></slot>
        <div class="align-start-x align-center-y width-100">
            <button @click="sendXhr()" class="btn-primary btn-small mar-10-r" v-if="!IS_SHOW_EMIT_BUTTON">
                <span v-if="loading == 0">Gönder</span>
                <span v-else>Yükleniyor | {{loading}}<i class="fa fa-spinner fa-spin mar-5-l"></i></span>
            </button>
            <button class="btn-small" @click="createInput()" v-if="fieldCreator">{{fieldCreator.buttonText}}</button>
            <button @click="dispatchForm()" v-if="IS_SHOW_EMIT_BUTTON" class="btn-primary btn-small mar-10-r">Gönder</button>
        </div>
    </div>

</template>
<script>
    import SearchSelect                                 from 'styland-ui/components/SearchSelect.vue'
    import MultiSelect                                  from 'styland-ui/components/MultiSelect.vue'
    import {TheMask}                                    from 'vue-the-mask'
    import {getAccessToken}                             from "styland-ui/prototypes/http/VueAuth"
    import {statusHandler}                              from 'styland-ui/prototypes/http/StatusHandler'
    import File                                         from "styland-ui/components/File.vue"
    import Datepicker                                   from "vuejs-datepicker"
    import {tr}                                         from "vuejs-datepicker/src/locale/index"
    import {oauth_token_header, spa_compatible_components} from "../../../styland.env"

    export default {
        components: {
            SearchSelect,
            TheMask,
            File,
            Datepicker,
            MultiSelect
        },
        props: {
            model: {
                required: true,
                type: Object
            },
            field: {
                required: true,
                type: Array
            },
            emitable: {
                type: Boolean,
                default: false
            },
            fieldCreator: Object,
            sendUrl: String,
            apiUrl: String,
            redirectUrl: [String, Object],
            method: String,
            groupClass: String,
            containerClass: String,
            elWrapperClass: String,
            fieldIconCallback: Object,
            nestedObjectSend: {
                default: true,
                type: Boolean
            }
        },
        data() {
            return {
                inputs: {},
                xhrMethod: '',
                selfField: '',
                loading: 0,
                dateLanguage: tr
            };
        },
        watch: {
            field(newVal) {
                this.selfField = newVal;
            },
            model: {
                handler(newVal) {
                    this.setInputs(newVal);
                },
                deep: true
            },
            apiUrl: "sendEditRequest",
        },
        methods: {

            // Form Inputlarının Bir Üst Komponente Gönderilmesini Sağlar
            dispatchForm() {
                delete this.inputs['undefined'];
                this.$emit('dispatch', this.inputs);
            },

            //  Form Sıfırlama
            resetForm() {
                for (let key in this.inputs) {
                    if (Array.isArray(this.inputs[key])) {
                        this.$set(this.inputs, key, []);
                    } else if (typeof this.inputs[key] === "object") {
                        if (Object.prototype.toString.call(this.inputs[key]) == '[object File]' || this.inputs[key] == null) {
                            this.$set(this.inputs, key, '');
                        } else {
                            this.$set(this.inputs, key, {});
                        }
                    } else if (typeof this.inputs[key] === "undefined" || typeof key === "undefined") {
                        this.$delete(this.inputs, key);
                    } else {
                        this.$set(this.inputs, key, '');
                    }
                }
            },

            // Form Tipine Göre Form Sıfırlama yada Yönlendirme İşlemleri
            responseSuccessHandler() {
                if (this.method == 'post') {
                    this.resetForm();
                } else {
                    this.redirectPage();
                }
            },

            getFormData() {
                let formData = new FormData();
                let conStr   = '';
                for (let key in this.inputs) {
                    let obj      = {};
                    if (typeof this.inputs[key] !== "undefined"  && this.inputs[key] !== null && this.inputs[key] != '') {
                        if (Array.isArray(this.inputs[key]) == true){
                            this.inputs[key].forEach(value => {
                                formData.append(`${key}[]`, value);
                            })
                        } else if (typeof this.inputs[key] === "object" && Object.prototype.toString.call(this.inputs[key]) != '[object File]') {
                            for (let objKey in this.inputs[key]) {
                                if (Object.prototype.toString.call(this.inputs[key][objKey]) != '[object File]' && this.nestedObjectSend) {
                                    obj[objKey] = this.inputs[key][objKey];
                                } else {
                                    conStr = key + '-' + objKey;
                                    formData.append(conStr, this.inputs[key][objKey]);
                                }
                            }
                            formData.append(key, JSON.stringify(obj));
                        } else {
                            formData.append(key, this.inputs[key]);
                        }
                    }
                }
                if (this.method == "put") {
                    formData.append('_method', 'put')
                }
                return formData;
            },


            // Form İçerisinden Yeni Bir Input Oluşturma Fonksiyonu
            createInput() {
                this.fieldCreator.field.forEach((item) => {
                    this.$vueSet(this.inputs, item.model + this.selfField.length, '')
                    let field = new Object;
                    for (let key in item) {
                        if (key == 'model') {
                            field[key] = item.model + this.selfField.length
                        } else {
                            field[key] = item[key];
                        }
                    }
                    this.selfField.push(field);
                })
            },

            // Button (Click) -> send Axios Ajax Reqeest To Server Side
            sendXhr() {
                axios({
                    url: this.sendUrl,
                    method: "POST",
                    data: this.getFormData(),
                    headers: {
                        "Authorization": this.getAuthorizationHeader()
                    },
                    onUploadProgress: (progress) => {
                        this.loading = Math.round(progress.loaded / progress.total * 100);
                    }
                }).then(response => {
                    new statusHandler(response).get('#app', true, () => {
                        this.responseSuccessHandler();
                        this.$emit('success', response);
                        this.loading = 0;

                    });
                }).catch(error => {
                    new statusHandler(error.response).get('#app', true, () => {
                        this.$emit('error', error.response);
                        this.loading = 0;
                    })
                })
            },

            // Form Input Verilerinin Belirtilen Linke İstek Yaparak Doldurulmasını Sağlar. Edit Formlarında Üst Komponentden Verileri Almak İstemediğimiz Durumlarda Kullanırız.
            sendEditRequest() {
                if (typeof this.apiUrl === 'string' && this.apiUrl != '') {
                    axios.get(this.apiUrl, {
                        headers: {
                            "Authorization": this.getAuthorizationHeader()
                        }
                    }).then(response => {
                        for (let key in response.data) {
                            this.$vueSet(this.inputs, key, response.data[key]);
                        }
                        this.$emit('success', response);
                    }).catch(error => {
                        new statusHandler(error.response).get('#app', true, (message, data, statusType, status) => {
                            this.$emit('error', data);
                        });
                    })
                }
            },

            setInputWithFile(val, key) {
                for (let i = 0; i < val.length; i++) {
                    this.$vueSet(this.inputs, key + parseInt(i+1), val[i].file)
                }
            },
            setDatepickerInput(value, key) {
                const formatedDate = moment(value).format('YYYY-MM-DD');
                this.$vueSet(this.inputs, key, formatedDate);
            },
            redirectPage() {
                if (typeof this.redirectUrl !== 'undefined' && this.redirectUrl != '') {
                    if (spa_compatible_components) {
                        this.$router.push(this.redirectUrl);
                    } else {
                        location.href = this.redirectUrl;
                    }
                }
            },
            getAuthorizationHeader() {
                if (oauth_token_header) {
                    return getAccessToken();
                }
                return;
            },
            setInputs(model) {
                for (let key in model) {
                    let value;
                    if (typeof model[key] === 'object') {
                        value = JSON.parse(JSON.stringify(model[key]));
                    } else {
                        value = model[key];
                    }
                    // // this.$set(this.inputs, key, this.deepInputs[key]);
                    // console.log(this.$deepModel(this.inputs)[key]);
                    this.$vueSet(this.inputs, key, value);
                }
            }
        },
        computed: {
            deepInputs() {
                return this.$deepModel(this.inputs);
            },
            IS_SHOW_EMIT_BUTTON () {
                return this.sendUrl === undefined && this.emitable === true;
            }
        },
        mounted() {
            this.setInputs(this.model);
            this.selfField  = this.field;

            /* For Api Mode */
            this.sendEditRequest();
        }
    }
</script>