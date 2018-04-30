import Vue from 'vue'
import axios from 'axios'

import App from './App'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import Toasted from 'vue-toasted'

Vue.use(BootstrapVue);
if (!process.env.IS_WEB) Vue.use(require('vue-electron'));


import DateStore from './utils/DataStore'

//存储
Vue.http = Vue.prototype.$http = axios
Vue.db = Vue.prototype.$db = DateStore;


Vue.config.productionTip = false

/* eslint-disable no-new */
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './assets/scss/app.css'

Vue.use(Toasted);
new Vue({
  components: {App},
  router,
  store,
  template: '<App/>'
}).$mount('#app')
