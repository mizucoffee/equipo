<template>
  <div class="text-center">
    <div class="my-2">
      <v-btn x-large color="accent" class="ma-2" dark>持ち出し処理</v-btn>
      <v-btn x-large color="accent" class="ma-2" dark to="return"
        >返却処理</v-btn
      >
      <v-btn x-large color="accent" class="ma-2" dark to="manage"
        >備品管理</v-btn
      >
      <v-btn x-large color="error" class="ma-2" dark @click="logout"
        >ログアウト</v-btn
      >
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "MainMenu",

  components: {},
  methods: {
    logout: function () {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
});
</script>
