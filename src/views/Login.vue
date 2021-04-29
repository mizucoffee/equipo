<template>
  <v-card width="400px" class="mx-auto mt-5">
    <v-card-title>
      <v-img
        :src="require('../assets/equipo_logo.png')"
        contain
        height="100"
        style="overflow: visible"
        transition="scale-transition"
        class="my-4"
      />
      <h2 class="text-center">Login</h2>
    </v-card-title>
    <v-card-text>
      <v-form>
        <v-text-field
          v-model="email"
          prepend-icon="mdi-email"
          label="Email"
          required
        ></v-text-field>
        <v-text-field
          v-model="password"
          prepend-icon="mdi-lock"
          label="Password"
          type="password"
          required
          @keyup.enter="login()"
        ></v-text-field>

        <v-card-actions>
          <v-btn class="mr-4" @click="login">Login</v-btn>
        </v-card-actions>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import Vue from "vue";
import firebase from "firebase/app";
import "firebase/auth";

export default Vue.extend({
  name: "Login",

  components: {},
  data() {
    return {
      email: "",
      password: "",
      auth: firebase.auth(),
    };
  },
  methods: {
    login: async function () {
      await this.$store.dispatch("signout");

      try {
        const userCredential = await this.auth.signInWithEmailAndPassword(
          this.email,
          this.password
        );
        this.$store.commit("onAuthStateChanged", userCredential.user);
        this.$router.push(`${this.$route.query.redirect}` || "/");
      } catch (e) {
        alert("ログインに失敗しました");
      }
    },
  },
});
</script>

<style lang="stylus" scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap');

h2 {
  font-family: 'Quicksand', sans-serif;
  width: 100%;
}
</style>
