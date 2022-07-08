import Vue from "vue";
import App from "./App.vue";
import router from "./router";

import {
  ValidationProvider,
  ValidationObserver,
  localize,
  extend
} from 'vee-validate'
import * as rules from 'vee-validate/dist/rules'
import es from 'vee-validate/dist/locale/es.json'
for (const rule in rules) {
  extend(rule, rules[rule])
}

localize('es', es)
//bootstrap
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
//axios
import axios from "axios";
import VueAxios from "vue-axios";

Vue.component("ValidationProvider", ValidationProvider);
Vue.component("ValidationObserver", ValidationObserver);
Vue.use(VueAxios, axios);
// axios.defaults.baseURL = 'http://localhost:5200/api/'
Vue.config.productionTip = false;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
