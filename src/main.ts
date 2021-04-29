import Vue from "vue";
import App from "./App.vue";
import Router from "./router";
import Store from "./store";
import vuetify from "./plugins/vuetify";
import firebase from "firebase/app";

Vue.config.productionTip = false;

const config = {
  apiKey: "AIzaSyBmgQLQifM3Bu6YUCNx5ZK7HuQva0DZDJg",
  authDomain: "equipo-mizucoffee.firebaseapp.com",
  projectId: "equipo-mizucoffee",
  storageBucket: "equipo-mizucoffee.appspot.com",
  messagingSenderId: "557665149242",
  appId: "1:557665149242:web:1f098b7547cb86fe19f003",
};
const app = firebase.initializeApp(config);
const store = Store(app);
const router = Router(app, store);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
