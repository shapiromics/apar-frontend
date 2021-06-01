<script>
import { reactive } from "@vue/composition-api";
import { useMutation, useQuery } from "@vue/apollo-composable";

import { useAuth } from "@/modules/auth.js";
import { writeCache } from "@/modules/apollo-utils.js";

export default {
  setup(props, context) {
    const { token, setToken, isLoggedInQuery, revokeTokenMutation } = useAuth();

    const state = reactive({
      isLoggedIn: false,
    });

    const drawerItems = [
      { label: "Job History", route: "/job/history" },
      {
        label: "BacGWASim",
        group: "bacgwasim",
        subItems: [
          { label: "About", route: "/bacgwasim/about" },
          { label: "Job", route: "/bacgwasim/job" },
        ],
      },
      {
        label: "SplitStrains",
        group: "splitstrains",
        subItems: [
          { label: "About", route: "/splitstrains/about" },
          { label: "Job", route: "/splitstrains/job" },
        ],
      },
    ];

    const toolsItems = [
      { label: "BacGWASim", route: "/bacgwasim/about" },
      { label: "SplitStrains", route: "/splitstrains/about" },
    ];

    // Query login status
    const { onResult } = useQuery(isLoggedInQuery);
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
      drawerItems,
      toolsItems,
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
      <v-menu offset-y open-on-hover>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">Tools</v-btn>
        </template>
        <v-list>
          <v-list-item
            v-for="tool in toolsItems"
            :key="tool.label"
            :to="tool.route"
          >
            <v-list-item-title>{{ tool.label }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <v-btn text class="mx-2" to="/about">About</v-btn>
      <v-btn text class="mx-2" to="/help">Help</v-btn>
      <v-btn v-if="!state.isLoggedIn" text class="mx-2" to="/signin">
        Sign In
      </v-btn>
      <v-btn v-if="state.isLoggedIn" text class="mx-2" @click="logout">
        Log Out
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-if="state.isLoggedIn" app clipped>
      <v-list>
        <template>
          <div v-for="drawerItem in drawerItems" :key="drawerItem.label">
            <v-list-group
              v-if="drawerItem.subItems"
              :group="drawerItem.group"
              no-action
              link
            >
              <template v-slot:activator>
                <v-list-item-content>
                  <v-list-item-title
                    v-text="drawerItem.label"
                  ></v-list-item-title>
                </v-list-item-content>
              </template>
              <v-list-item
                v-for="subItem in drawerItem.subItems"
                :key="subItem.label"
                :to="subItem.route"
              >
                <v-list-item-content>
                  <v-list-item-title v-text="subItem.label"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-group>

            <v-list-item v-else :to="drawerItem.route" link>
              <v-list-item-content>
                <v-list-item-title
                  v-text="drawerItem.label"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </div>
        </template>
      </v-list>
    </v-navigation-drawer>

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
