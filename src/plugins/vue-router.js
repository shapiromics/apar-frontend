import Vue from "vue"
import Router from "vue-router"

import Home from "../components/Home.vue"
import JobBacGWASim from "../components/JobBacGWASim.vue"
import JobHistory from "../components/JobHistory.vue"
import NotFound from "../components/NotFound.vue"
import SignIn from "../components/SignIn.vue"
import SplitStrains from "../components/SplitStrains.vue"

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
      path: "/job/history",
      name: "JobHistory",
      component: JobHistory
    },
    {
      path: "/job/bacgwasim",
      name: "JobBacGWASim",
      component: JobBacGWASim
    },
    {
      path: "/signin",
      name: "SignIn",
      component: SignIn
    },
    {
      path: "/job/splitstrains",
      name: "SplitStrains",
      component: SplitStrains
    },  
    { path: "*", component: NotFound },
  ],
})

export default router
