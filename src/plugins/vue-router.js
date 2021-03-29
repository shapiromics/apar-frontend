import Vue from "vue"
import Router from "vue-router"

import Home from "../components/Home.vue"
import NotFound from "../components/NotFound.vue"
import SignIn from "../components/SignIn.vue"

Vue.use(Router)

const router = new Router({
  mode: "history",
  routes: [

    {
      path: "/",
      name: "Home",
      component: Home
    },
    {
      path: "/signin",
      name: "SignIn",
      component: SignIn
    },
    { path: "*", component: NotFound },
  ],
})

export default router
