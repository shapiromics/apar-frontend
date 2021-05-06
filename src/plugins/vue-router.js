import Vue from "vue";
import Router from "vue-router";

import useAuth from "@/modules/auth.js";

import Home from "../components/Home.vue";
import JobBacGWASim from "../components/JobBacGWASim.vue";
import JobHistory from "../components/JobHistory.vue";
import NotFound from "../components/NotFound.vue";
import SignIn from "../components/SignIn.vue";
import SplitStrains from "../components/SplitStrains.vue";

Vue.use(Router);

const { isLoggedIn, refreshToken } = useAuth();

const router = new Router({
  mode: "history",
  routes: [
    {
      path: "/",
      name: "Home",
      component: Home,
    },
    {
      path: "/job/history",
      name: "JobHistory",
      component: JobHistory,
      meta: { registered: true },
    },
    {
      path: "/job/bacgwasim",
      name: "JobBacGWASim",
      component: JobBacGWASim,
      meta: { registered: true },
    },
    {
      path: "/signin",
      name: "SignIn",
      component: SignIn,
      meta: { guest: true },
    },
    {
      path: "/job/splitstrains",
      name: "SplitStrains",
      component: SplitStrains,
      meta: { registered: true },
    },
    { path: "*", component: NotFound },
  ],
});

function rerouting(to, next) {
  isLoggedIn().then((userIsLoggedIn) => {
    // Pages for authenticated users
    if (to.matched.some((record) => record.meta.registered)) {
      if (userIsLoggedIn) {
        next();
        return;
      }
      next("/signin");
      // Pages for non-authenticated users
    } else if (to.matched.some((record) => record.meta.guest)) {
      if (userIsLoggedIn) {
        next("/home");
        return;
      }
      next();
    }
    next();
  });
}

router.beforeEach((to, from, next) => {
  if (from.name == undefined) {
    refreshToken()
      .then(rerouting(to, next))
      .catch(() => {
        // Cannot refresh if user is not logged in.
      });
  } else {
    rerouting(to, next);
  }
});

export default router;
