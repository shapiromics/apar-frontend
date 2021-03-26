<script>
import { reactive } from "@vue/composition-api";

export default {
  setup() {
    const state = reactive({
      isLoggedIn: false,
    });

    return {
      state,
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
      <v-btn v-if="state.isLoggedIn" text class="mx-2" to="/splitstrains"
        >Split Strains</v-btn
      >
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
