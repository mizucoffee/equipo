<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Equipo Logo"
          class="shrink mr-3"
          contain
          :src="require('./assets/equipo_icon_white.png')"
          transition="scale-transition"
          width="40"
        />
        <v-img
          :src="require('./assets/equipo_white.svg')"
          contain
          width="100"
          style="overflow: visible;"
          transition="slide-x-transition"
        />
      </div>
      <v-spacer></v-spacer>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
  name: "App",

  data: () => ({
    //
  }),
});
</script>
