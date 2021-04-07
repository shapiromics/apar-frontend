import Vue from "vue";
import App from "@/App.vue";

// Composition API
import VueCompositionAPI, { 
  provide,
  onMounted, 
  onErrorCaptured,
} from "@vue/composition-api";
Vue.use(VueCompositionAPI);

import router from "@/plugins/vue-router.js";
import vuetify from "@/plugins/vuetify.js";

// Apollo Client
import apolloClient from "@/plugins/vue-apollo-client.js"
import { DefaultApolloClient } from "@vue/apollo-composable";

// Apollo
import VueApollo from "vue-apollo"
Vue.use(VueApollo)

// Authentification helpers
import useAuth from "@/modules/auth.js";
import { writeCache } from "@/modules/apollo-utils.js";
import { useMutation } from "@vue/apollo-composable";

new Vue({
  // Vue3 setup
  setup() {
    // Setup apolloClient
    provide(DefaultApolloClient, apolloClient);

    // On Mounted, check if token in
    onMounted(() => {
      const { setToken, refreshTokenMutation } = useAuth();
      const { mutate: tokenRefresh } = useMutation(refreshTokenMutation);
      tokenRefresh(
        {},
        {
          update: (cache, { data }) => {
            setToken(data.refreshToken.token);
            writeCache(cache, "isLoggedIn", true);
          },
        }
      ).catch(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          console.log("GQL Error ", graphQLErrors);
        }
        if (networkError) {
          console.log("Network Error ", networkError);
        }
      });
    });

    // On errorCaptured - general err
    onErrorCaptured((err, comp, stuff) => {
      console.log("In onErrorCaptured");
      console.log(err);
      console.log(comp);
      console.log(stuff);
    });

  },
  router,
  vuetify,
  render: (h) => h(App),
}).$mount("#app")