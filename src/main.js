import Vue from 'vue'
import App from './App'
import {get, post, errorCaptured, deleteRequest} from '@/utils/http'
import storage from '@/utils/storage'
import store from '@/store'
import oss from '@/utils/oss'
import util from '@/utils/util'
import api from '@/utils/api'
Vue.prototype.$api = api
Vue.prototype.$oss = oss
Vue.prototype.$get = get
Vue.prototype.$post = post
Vue.prototype.$deleteRequest = deleteRequest
Vue.prototype.$cap = errorCaptured
Vue.prototype.$store = store
Vue.prototype.$storage = storage
Vue.prototype.$util = util
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    store,
    ...App
})
app.$mount()
