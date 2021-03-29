import Vue from "vue";
import App from "@/App.vue";

// Composition API
import VueCompositionAPI, { provide } from "@vue/composition-api";
Vue.use(VueCompositionAPI);

import router from "@/plugins/vue-router.js";
import vuetify from "@/plugins/vuetify.js";

// Apollo Client
import apolloClient from "@/plugins/vue-apollo-client.js"
import { DefaultApolloClient } from "@vue/apollo-composable";

// Apollo
import VueApollo from "vue-apollo"
Vue.use(VueApollo)

// // Authentification helpers
// import useAuth from "@/modules/auth.js";
// import { writeCache } from "@/modules/apollo-utils.js";
// import { useMutation } from "@vue/apollo-composable";


new Vue({
  // Vue3 setup
  setup() {
    // Setup apolloClient
    provide(DefaultApolloClient, apolloClient);
  },
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app")