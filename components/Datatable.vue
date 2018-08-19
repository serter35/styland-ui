<template>
    <div class="dt">
        <!-- Table-Box -->
        <modal v-model="modalShow" :closable="false">
            <div class="mod-body" slot="body">
                <i class="far fa-times-circle align-center-x fc-danger fa-7x mar-25-b"></i>
                <h4 class="text-center mar-25-b">Kayıt Silinsin mi?</h4>
                <p class="text-center width-75 mar-auto-x fs-lg mar-25-b">Gerçekten bu kaydın silinmesini istiyor musunuz? Bu işlem gerçekleşmesi durumunda geri alınamaz.</p>
                <div class="align-center-x">
                    <button class="btn-default mar-10-r btn-large" @click="resetModal()">İptal</button>
                    <button class="btn-danger btn-large" @click="removeRow()">Sil</button>
                </div>
            </div>
        </modal>

        <div class="tbl">
            <!-- Loading -->
            <div class="loading-container align-center direction-y" v-show="loading" style="min-height: 445px">
                <h3 class="mar-30-b">Yükleniyor...</h3>
                <i class="text-size-24 fa fa-spin fa-spinner"></i>
            </div>
            <!-- Table -->
            <div class="dt-content" v-show="!loading">
                <!-- Table Head -->
                <div class="tbl-row tbl-row-head">
                    <span class="tbl-col dt-row-hiddens-col" v-if="IS_SHOW_HIDDEN_CELL_BUTTON">
                        <p class="btn-small btn-icon">#</p>
                    </span>
                    <span class="tbl-col dt-col" v-for="(column, index) in Column" v-if="column.visible" :class="{'focused': focusedInputIndex == index}">
                        <span @click="sortTable(column.key, index)" class="fa-icon right tbl-head">
                            {{column.value | capitalize}}
                            <i class="fa order-icon" :class="column.order"></i>
                        </span>
                        <i class="fa-icon fa-search right" @click="onClickSearchIcon(index)" v-if="column.search !== false"></i>
                        <i class="fa-icon fa-times" @click="onClickCloseIcon()" v-if="column.search !== false"></i>
                        <input type="text"
                               v-focus="focusedInputIndex == index"
                               @blur="() => { if (searchInput == '') focusedInputIndex = -1; }"
                               placeholder="Arama sözcüğünü giriniz"
                               @keyup="searchEvent($event, column.key)"
                               v-model="searchInput"
                               v-if="column.search !== false"
                        >
                    </span>
                    <span class="tbl-col" v-show="management_button_show"><p class="tbl-head">Yönetim</p></span>
                </div>
                <!-- Table Body -->
                <ul>
                    <li v-for="(data, index) in Data">
                        <div class="tbl-row">
                            <!-- Hidden Cols Toggle Button -->
                            <span class="tbl-col dt-row-hiddens-col" v-if="IS_SHOW_HIDDEN_CELL_BUTTON">
                                <button class="btn-small btn-icon dt-btn-circle" @click="setVisible(index)">
                                    <i class="fa fa-plus" :class="{'open': data.visible === true }"></i>
                                </button>
                            </span>
                            <!-- Table Col -->
                            <span v-for="column in Column" class="tbl-col" v-if="column.visible">
                                <span v-if="typeof column.image == 'undefined'" class="tbl-text dt-text" :data-before="column.before" :data-after="column.after">
                                    <span v-if="column.concatBefore" :class="[column.concatBefore.className]">{{getDeepData(index)[column.concatBefore.key]}}</span>
                                    {{typeof column.as !== 'object' ? getDeepData(index)[column.key] : column.as[getDeepData(index)[column.key]]}}
                                    <span v-if="column.concatAfter" :class="[column.concatAfter.className]">{{getDeepData(index)[column.concatAfter.key]}}</span>
                                </span>
                                <img :src="getDeepData(index)[column.key]" class="dt-img" v-else>
                            </span>
                            <!-- Table Col Buttons -->
                            <span class="tbl-col tbl-col-btn" v-show="management_button_show">
                                <!-- Edit Button -->
                                <button
                                    @click.prevent="linkHandler(routeResolver(index, editButton.url))"
                                    v-if="visibility(editButton)"
                                    class="btn-success btn-small"
                                    :class="editButton.className"
                                    :style="editButton.style"
                                    :id="editButton.id"
                                >
                                    <i class="far fa-edit mar-5-r"></i>
                                    <span>{{editButton.text ? editButton.text : 'Düzenle'}}</span>
                                </button>

                                <!-- Delete Button -->
                                <button
                                    @click.prevent="removeModalOpen(getDeepData(index)[primaryKey], index)"
                                    v-if="visibility(deleteButton)"
                                    class="btn-danger btn-small"
                                    :class="deleteButton.className"
                                    :style="deleteButton.style"
                                    :id="deleteButton.id"
                                >
                                    <i class="far fa-trash-alt mar-5-r"></i>
                                    <span>{{deleteButton.text ? deleteButton.text : 'Sil'}}</span>
                                </button>

                                <!-- Drop Button -->
                                <div class="v-dropdown center tbl-btn"
                                     v-if="visibility(dropButton)"
                                     :class="{'active': activeDropdownIndex == index}"
                                >
                                    <a href="#"
                                       v-html="dropButton.button.html"
                                       :class="dropButton.button.className"
                                       :style="dropButton.button.style"
                                       @click.stop.prevent="setActiveDropdownIndex(index)"
                                    ></a>
                                    <div class="drop-box">
                                        <ul>
                                            <li v-for="item in dropButton.items">
                                                <a href="#"
                                                   @click.prevent="linkHandler(_replaceText(item.url, '{id}', data[primaryKey]))"
                                                   :class="item.className"
                                                   :style="item.style"
                                                   v-html="item.html"
                                                   v-if="visibility(item)"
                                                ></a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>

                                <!-- Callback Button -->
                                <template v-if="get_callback_button_type == 'array'">
                                    <a class="tbl-btn" :class="btnObj.className" @click="callbackButtonClicked(data, index, btnObj)" v-html="btnObj.html" v-for="btnObj in callbackButton" v-if="visibility(btnObj)"></a>
                                </template>
                                <template v-if="get_callback_button_type == 'object'">
                                    <a class="tbl-btn" :class="callbackButton.className" @click="callbackButtonClicked(data, index, callbackButton)" v-html="callbackButton.html" v-if="visibility(callbackButton)"></a>
                                </template>
                            </span>
                        </div>

                        <div class="dt-row-hiddens" :class="{'active' : data.visible}" ref="cellHiddenGroup">
                            <div v-for="column in Column" class="tbl-col" v-if="!column.visible">
                                <b class="fw-500 pad-5-r">{{column.value | capitalize}} :</b>
                                <span v-if="typeof column.image == 'undefined'" class="tbl-text dt-text" :data-before="column.before" :data-after="column.after">
                                    <span v-if="column.concatBefore" :class="[column.concatBefore.className]">{{getDeepData(index)[column.concatBefore.key]}}</span>
                                    {{typeof column.as !== 'object' ? getDeepData(index)[column.key] : column.as[getDeepData(index)[column.key]]}}
                                    <span v-if="column.concatAfter" :class="[column.concatAfter.className]">{{getDeepData(index)[column.concatAfter.key]}}</span>
                                </span>
                                <img :src="getDeepData(index)[column.key]" class="dt-img" v-else>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <!-- Paginate -->
        <div class="align-center pad-10-t" v-if="isPagination === true">
            <i class="fa fa-chevron-left" @click="changePage(query.page - 1)" v-if="query.page > 1"></i>
            <span class="pad-10" v-for="n in compPageCount" @click="changePage(n)" :class="n == query.page ? 'active' : ''">{{n}}</span>
            <i class="fa fa-chevron-right" @click="changePage(query.page + 1)" v-if="query.page < paginateOptions.last_page"></i>
        </div>
    </div>
</template>

<script>
    import lodash             from 'lodash'
    import {statusHandler}    from "styland-ui/prototypes/http/StatusHandler";
    import { focus }          from 'vue-focus';
    import { getAccessToken } from 'styland-ui/prototypes/http/VueAuth'
    import { oauth_token_header, spa_compatible_components }  from "../../../styland.env";
    import Modal              from 'styland-ui/components/Modal.vue';

    export default {
        directives: { focus: focus },
        components: { Modal },
        props: {
            cell: {
                required: true,
                type: Array
            },
            apiUrl: {
                required: true,
                type: [String, Array]
            },
            primaryKey: {
                type: String,
                default: "id"
            },
            isPagination: {
                type: Boolean,
                default: true
            },
            isOrderby: {
                type: Boolean,
                default: true
            },
            isSearch: {
                type: Boolean,
                default: true
            },
            refresh: {
                type: Boolean,
                default: false
            },
            editButton:     Object,
            deleteButton:   Object,
            dropButton:     Object,
            callbackButton: [Object, Array],
            fetchMap:       Object,
        },
        data() {
            return {
                Data: "",
                Column: [],
                pageShowItem: 10,
                query: { "page": 1 },
                paginateOptions: '',
                loading: false,
                _: lodash,
                clickedModalBtnIndex: -1, // This Variable Using For Modal Button Loading Animation,
                activeDropdownIndex: -1,
                focusedInputIndex: -1,
                searchInput: '',
                modalShow: false,
                deleteObject: {}
            }
        },
        watch: {
            refresh(newVal) {
                if (newVal == true) {
                    this.apiUrlHandler();
                }
            },
            apiUrl: "apiUrlHandler",
            cell: "initSetterColumn"
        },
        computed: {
            IS_SHOW_HIDDEN_CELL_BUTTON() {
                return this.Column.some(item => item.visible == false);
            },
            compPageCount () {
                let pageStore = [];
                if (this.paginateOptions.last_page !== "undefined") {
                    let start  = this.query.page - 2 > 0 ? this.query.page - 2 : 1;
                    let finish = this.query.page + 2 < this.paginateOptions['last_page'] ? this.query.page + 2 : this.paginateOptions['last_page'];
                    for (let i = start; i <= finish; i++) {
                        pageStore.push(i)
                    }
                    return pageStore;
                }
            },
            management_button_show() {
                return this.visibility(this.editButton) || this.visibility(this.deleteButton) || this.dropButton || this.callbackButton;
            },
            get_callback_button_type() {
                if (Array.isArray(this.callbackButton)) {
                    return 'array'
                } else if (typeof  this.callbackButton === 'object') {
                    return 'object'
                }
            }
        },
        filters: {
            capitalize(value) {
                return value.charAt(0).toLocaleUpperCase('tr-TR') + value.slice(1)
            }
        },
        methods: {
            linkHandler(value) {
                if (spa_compatible_components) {
                    this.$router.push(value);
                } else {
                    location.href = value;
                }
            },
            callbackButtonClicked(dataItem, dataIndex, btnObj) {
                btnObj.fn(dataItem, dataIndex, this);
            },
            _replaceText(text, searchKey, replaceKey) {
                return text.replace(searchKey, replaceKey);
            },
            getDeepData(index) {
                return this.$deepModel(this.Data[index])
            },
            addVisibleKeyInData() {
                this.Data.forEach((input, index) => {
                    this.$set(this.Data[index], 'visible', false);
                })
            },
            initSetterColumn() {
                this.Column = this.cell;
                this.addOrderKeyInColumn();
                this.addVisibleKeyInColumn();
            },
            checkCellVisibility(cell) {
                if (cell.state === 'hidden') {
                    return false;
                } else if (cell.state === 'mobile' && window.innerWidth <= 768) {
                    return false;
                }
                return true;
            },
            addVisibleKeyInColumn() {
                this.Column.forEach((cell, index) => {
                    this.$set(this.Column[index], 'visible', this.checkCellVisibility(cell));
                });
            },
            setVisible(index) {
                this.Data[index].visible =! this.Data[index].visible;
                let h = 0;
                if (this.Data[index].visible) {
                    let childs = this.$refs.cellHiddenGroup[index].children;
                    for (let i = 0; i < childs.length; i++) {
                        h += childs[i].clientHeight;
                    }
                }
                this.$refs.cellHiddenGroup[index].style.setProperty('max-height', h + 'px');
            },
            addOrderKeyInColumn() {
                this.Column.forEach((cell) => {
                    this.$set(cell, "order", "")
                });
            },
            // Liste Veilerini Getirmek İçin İstek Yapan Fonksyion
            sendXhrRequest() {
                window.axios.get(this.apiUrl, {
                    params: this.query,
                    headers: {
                        Authorization: this.getAuthorizationHeader()
                    }
                }).then(response => {
                    this.setFetchData(response);
                    this.addVisibleKeyInData();
                    this.loading = false;
                    this.$emit('refresh', false);
                    this.$emit('input', response);
                }).catch(error => {
                    console.log(error.response);
                    this.loading = false;
                    this.$emit('refresh', false);
                    this.$emit('input', []);
                })
            },
            setFetchData(response) {
                if (typeof this.fetchMap === 'object') {
                    this.Data        = this.$deepModel(response)[this.fetchMap.data];
                    const pagination = this.$deepModel(response)[this.fetchMap.page];
                    if (typeof this.fetchMap.page === 'string') {
                        this.setPaginateOptions(pagination);
                    }
                } else if (this.isPagination) {
                    this.setPaginateOptions(response.data);
                    this.Data = response.data.data;
                } else {
                    this.Data = response.data;
                }
            },

            // Laravel'den gelen sayfalama options'ları alınıyor (eg: last_page)
            setPaginateOptions (response) {
                this.paginateOptions = new Object();
                for (let key in response) {
                    if (key != "data") {
                        this.paginateOptions[key] = response[key];
                    }
                }
            },
            changePage(page) {
                if (page > 0) {
                    this.loading = true;
                    this.query['page'] = page;
                    this.sendXhrRequest();
                }
            },
            searchEvent(e, searchColumn) {
                if (e.keyCode == 27 || e.target.value.length == 0) {
                    this.loading    = true;
                    this.$delete(this.query, 'search-column');
                    this.$delete(this.query, 'search');
                    this.sendXhrRequest();
                    this.query.page = 1;
                    this.searchInput = '';
                    this.focusedInputIndex = -1;
                } else {
                    this.searchWithDebounce(e, searchColumn);
                }
            },
            searchWithDebounce: _.debounce(function (e, searchColumn) {
                this.loading                 = true;
                this.query['search']         = e.target.value;
                this.query['search-column']  = searchColumn;
                this.sendXhrRequest();
                this.query.page = 1;
            }, 500),
            sortTable(column, arrKey) {
                if (this.isOrderby) {
                    this.loading = true;
                    this.addOrderKeyInColumn(); // reset order class
                    if (column === this.query['order-column']) {
                        if (typeof this.query['order'] === "undefined") {
                            this.query['order']          = 'asc';
                            this.Column[arrKey]['order'] = {'fa-sort-amount-up': true}
                        } else if (this.query['order'] === 'asc') {
                            this.query['order']          = 'desc';
                            this.Column[arrKey]['order'] = {'fa-sort-amount-down': true}
                        } else {
                            this.query['order']          = undefined;
                            this.Column[arrKey]['order'] = ''
                        }
                    } else {
                        this.query['order']          = 'asc';
                        this.Column[arrKey]['order'] = {'fa-sort-amount-up': true}
                    }
                    this.query['order-column'] = column;
                    this.sendXhrRequest();
                }
            },
            removeModalOpen(dbId, sortId) {
                this.deleteObject  = {dbId, sortId}
                this.modalShow     = true;
            },
            removeRow() {
                const delete_url = this._replaceText(this.deleteButton.url, "{id}", this.deleteObject.dbId);
                axios.delete(delete_url, {
                    headers: {
                        Authorization: this.getAuthorizationHeader()
                    }
                }).then(response => {
                    if (typeof this.apiUrl === 'string') {
                        this.resetModal();
                        this.sendXhrRequest();
                    } else if (Array.isArray(this.apiUrl)) {
                        this.resetModal();
                        this.Data.splice(this.deleteObject.sortId, 1);
                    }
                    new statusHandler(response).get("#app", true);
                }).catch(({response}) => {
                    new statusHandler(response).get("#app", true);
                });
            },
            resetModal() {
                this.modalShow    = false;
                this.deleteObject = {}
            },
            setActiveDropdownIndex(index) {
                if (index == this.activeDropdownIndex) {
                    this.activeDropdownIndex = -1;
                } else {
                    this.activeDropdownIndex = index;
                }
            },
            windowClickEventListener() {
                window.addEventListener('click', () => {
                    this.setActiveDropdownIndex(-1);
                })
            },
            routeResolver(index, prop) {
                let idVal = this.getDeepData(index)[this.primaryKey];
                if (typeof prop === 'object') {
                    let   deepProp = JSON.parse(JSON.stringify(prop));
                    const replace  = typeof deepProp.replace === "string" ? deepProp.replace : this.primaryKey;
                    if (typeof deepProp.route === 'object') {
                        if (typeof deepProp.route.params === 'object') {
                            deepProp.route.params[replace] = idVal;
                            return deepProp.route;
                        }
                    }
                } else if (typeof prop === 'string') {
                    return this._replaceText(prop, '{id}', idVal);
                }
                return;
            },
            apiUrlHandler() {
                if (typeof this.apiUrl === 'string') {
                    this.sendXhrRequest();
                } else if (Array.isArray(this.apiUrl)) {
                    this.Data    = this.apiUrl;
                    this.addVisibleKeyInData();
                    this.loading = false;
                }
            },
            getAuthorizationHeader() {
                if (oauth_token_header) {
                    return getAccessToken();
                }
                return;
            },
            onClickSearchIcon(index) {
                this.focusedInputIndex = index;
                this.searchInput = ''
            },
            onClickCloseIcon() {
                this.onClickSearchIcon(-1);
                this.$delete(this.query, 'search-column');
                this.$delete(this.query, 'search');
                this.sendXhrRequest();
            },
            visibility(item) {
                if (typeof item !== 'undefined') {
                    const show = item.show;
                    if (typeof show === 'boolean') {
                        return show;
                    } else if (typeof show === 'function') {
                        return show(this.editButton);
                    } else if (typeof show === 'string') {
                        return this.$can(show);
                    }
                    return true;
                }
                return false;
            }
        },
        mounted() {
            this.initSetterColumn();
            window.onresize = () => { this.addVisibleKeyInColumn(); }
            this.windowClickEventListener();
            this.loading = true;
            this.apiUrlHandler();
        }
    }
</script>

<!--
*** SERVER SIDE VUE DATATABLE ***
    /-- Requirements --/
        * Vue
        * Vue-Deepset
        * Axios
        * Lodash
        * Styland
    /-- API --/
        * cell
            - type: Array in Object
                - Object Keys
                    - text:  String - Required
                    - value: String - Required
                    - state: String - Optional - ('mobile' | 'hidden')
            - required
-->