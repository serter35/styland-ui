<template>
    <div class="align-start-y align-between-x">
        <div class="field-group" :class="{'optional': !required}">
            <label v-if="label" :for="id">{{label}}</label>
            <div class="input file">
                <input :id="id" type="file" :multiple="multiple" @change="changed($event)">
                <label class="placeholder" :data-content="buttonAttr" :for="id">{{placeholder}}</label>
            </div>
        </div>
        <div class="field-group optional" v-if="preview">
            <label>Fotoğraf Önizlemesi</label>
            <div class="image-preview">
                <img v-if="photoPreview" :src="photoPreview">
            </div>
        </div>
    </div>

</template>

<script>
    export default {
        name: "file",
        props: {
            id: {
                required: true,
                type: String
            },
            multiple: Boolean,
            value: String,
            buttonAttr: String,
            label: String,
            required: {
                type: Boolean,
                default: true
            },
            preview: {
                default: true,
                type: Boolean
            },
        },
        data() {
            return {
                files: [],
                chooseFileNames: '',
            }
        },
        watch: {
            value(newVal) {
                if (typeof newVal === "undefined" || newVal == '') {
                    this.files = [];
                    this.chooseFileNames = '';
                }
            }
        },
        computed: {
            placeholder() {
                return this.chooseFileNames != '' ? this.chooseFileNames : this.$slots.default[0].text
            },
            photoPreview() {
                if (this.files.length > 0) {
                    return this.files[0].blobUrl;
                } else if (typeof this.value === "string" && this.value !== '') {
                    return this.value;
                }
            }
        },
        methods: {
            getBlobUrl(file) {
                return URL.createObjectURL(file);
            },
            getBase64Encode(file) {
                return new Promise((resolve, reject) => {
                    const fileReader = new FileReader();
                    fileReader.readAsDataURL(file);
                    fileReader.onload  = ()    => resolve(fileReader.result);
                    fileReader.onerror = error => reject('error:' + error);
                })
            },
            setChooseFileNames(fileName) {
                if (this.chooseFileNames == '') {
                    this.chooseFileNames = fileName;
                } else {
                    this.chooseFileNames += ', ' + fileName;
                }
            },
            setFileStore: async function (files) {
                let file, blobUrl;
                this.files = [];

                for (let key in files) {
                    if (typeof files[key] === "object") {
                        file    = files[key];
                        blobUrl = this.getBlobUrl(file);
                        this.files.push({
                            "blobUrl": blobUrl,
                            "file"   : file,
                            "base64" : await this.getBase64Encode(file)
                        })
                        this.setChooseFileNames(file.name)

                    }
                }
                this.$emit('input', this.files);

            },
            changed(event) {
                this.chooseFileNames = '';
                const files = event.target.files;
                this.setFileStore(files);
            }
        }

    }
</script>
