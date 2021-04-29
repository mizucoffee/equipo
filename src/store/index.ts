import Vue from "vue";
import Vuex, { ActionTree, GetterTree, Store } from "vuex";
import firebase from "firebase/app";
import { State } from "@/models/state";

export default function (app: firebase.app.App): Store<State> {
  Vue.use(Vuex);

  const auth = firebase.auth(app);

  const state: State = {
    user: null,
  };

  const mutations = {
    onAuthStateChanged(state: State, user?: firebase.User) {
      state.user = user || null;
    },
    signOut(state: State) {
      state.user = null;
    },
  };

  const getters: GetterTree<State, State> = {
    isLoggedIn: ({ user }) => (user?.uid ? true : false),
  };

  const actions: ActionTree<State, State> = {
    async signout() {
      await auth.signOut();
      this.commit("signOut");
    },
  };

  return new Vuex.Store({
    state,
    mutations,
    getters,
    actions,
  });
}
