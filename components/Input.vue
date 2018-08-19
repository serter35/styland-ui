<template>
    <div class="input icon right underline"
         :class="[{'focus': focused || model != ''}, wrapperClass, inputtype]"
         :data-placeholder="$slots.default[0].text">
        <textarea v-if="inputtype == 'textarea'"
                  :type="type"
                  v-model="model"
                  style="min-width: unset"
                  @focus="focused = true"
                  @blur="focused = false"
                  :class="inputClass"
        >
        </textarea>
        <input v-else
               :type="type"
               v-model="model"
               style="min-width: unset"
               @focus="focused = true"
               @blur="focused = false"
               :class="inputClass"
        >
        <label v-show="iconClass" :class="iconClass" style="width: fit-content; padding-right: 5px;"></label>
    </div>
</template>

<script>
    import { focus } from 'vue-focus';
    export default {
        name: "UnderlineInput",
        directives: { focus: focus },
        props: {
            value: {
                type:[String, Number],
                default:""
            },
            type: {
                default: 'text',
                type: String
            },
            iconClass: String,
            wrapperClass: String,
            inputClass: String,

            inputtype:""
        },
        watch: {
            model(newVal) {
                this.$emit('input', newVal)
            },
            value(newVal) {
                this.model = newVal;
            }
        },
        data() {
            return {
                model: '',
                focused: false
            }
        },
        mounted() {
            this.model = this.value;
        }
    }
</script>