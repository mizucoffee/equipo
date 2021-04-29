import Vue from "vue";
import { Store } from "vuex";
import VueRouter, { RouteConfig } from "vue-router";
import MainMenu from "../views/MainMenu.vue";
import Login from "../views/Login.vue";
import firebase from "firebase/app";
import { State } from "@/models/state";

export default function (
  app: firebase.app.App,
  store: Store<State>
): VueRouter {
  Vue.use(VueRouter);

  const auth = firebase.auth(app);

  const routes: Array<RouteConfig> = [
    {
      path: "/",
      name: "MainMenu",
      component: MainMenu,
    },
    {
      path: "/login",
      name: "Login",
      component: Login,
      meta: { isPublic: true },
    },
  ];

  const router = new VueRouter({
    mode: "history",
    base: process.env.BASE_URL,
    routes,
  });

  function initAuth() {
    return new Promise((res) => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        store.commit("onAuthStateChanged", user);
        unsubscribe();
        res(user);
      });
    });
  }

  router.beforeEach(async (to, from, next) => {
    await initAuth();

    if (to.matched.some((r) => !r.meta.isPublic) && !store.getters.isLoggedIn)
      return next({ path: "/login", query: { redirect: to.fullPath } });
    if (to.matched.some((r) => r.meta.isPublic) && store.getters.isLoggedIn)
      return next({ path: `${to.query.redirect}` || "/" });
    next();
  });

  return router;
}
