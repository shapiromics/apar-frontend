import Vue from "vue";
import App from "@/App.vue";

import vuetify from "@/plugins/vuetify.js";


new Vue({
  // Vue3 setup
  setup() {},
  vuetify,
  render: (h) => h(App),
}).$mount("#app")