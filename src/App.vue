<script>
import { reactive } from "@vue/composition-api";
import { useMutation, useQuery } from "@vue/apollo-composable";
import gql from "graphql-tag";

import useAuth from "@/modules/auth.js";
import { writeCache } from "@/modules/apollo-utils.js";

export default {
  setup(props, context) {
    const { token, setToken, revokeTokenMutation } = useAuth();

    const state = reactive({
      isLoggedIn: false,
    });

    // Query login status
    const { onResult } = useQuery(
      gql`
        query {
          isLoggedIn @client
        }
      `
    );
    onResult((queryResult) => {
      state.isLoggedIn = queryResult.data.isLoggedIn;
    });

    // userLogout mutation
    const { mutate: userLogout } = useMutation(revokeTokenMutation);
    function mutateUserLogout() {
      userLogout(
        {},
        {
          update: (cache) => {
            setToken("");
            writeCache(cache, "isLoggedIn", false);
            context.root.$router.push("/signin");
          },
        }
      );
    }

    // Logout the user
    function logout() {
      mutateUserLogout();
    }

    return {
      token,
      state,
      logout,
    };
  },
};
</script>


<template>
  <v-app id="app">
    <v-app-bar app class="elevation-1" clipped-left clipped-right>
      <v-toolbar-title
        style="cursor: pointer"
        @click="$router.push('/', () => {})"
      >
        APAR
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn v-if="state.isLoggedIn" text class="mx-2" to="/tool1">Tool1</v-btn>
      <v-btn v-if="state.isLoggedIn" text class="mx-2" to="/tool2">Tool2</v-btn>
      <v-btn v-if="state.isLoggedIn" text class="mx-2" to="/splitstrains">Split Strains</v-btn>
      <!-- <v-btn v-if="state.isLoggedIn" text class="mx-2" to="/fileupload">File Upload</v-btn> -->
      <v-btn v-if="state.isLoggedIn" text class="mx-2" to="/jobhistory">
        Job History
      </v-btn>
      <v-btn text class="mx-2" to="/about">About</v-btn>
      <v-btn text class="mx-2" to="/help">Help</v-btn>
      <v-btn v-if="!state.isLoggedIn" text class="mx-2" to="/signin">
        Sign In
      </v-btn>
      <v-btn v-if="state.isLoggedIn" text class="mx-2" @click="logout">
        Log Out
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
