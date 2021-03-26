import Vue from "vue";
import App from "@/App.vue";

// Composition API
import VueCompositionAPI from "@vue/composition-api";
Vue.use(VueCompositionAPI);

import router from "@/plugins/vue-router.js";
import vuetify from "@/plugins/vuetify.js";


new Vue({
  // Vue3 setup
  setup() {},
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app")